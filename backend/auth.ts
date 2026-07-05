import { StoredUser } from "common/auth/users.ts";

// recommended iterations for PBKDF2 with SHA-256 
const ITERATIONS = 100_000;

/**
 * generates a secure PBKDF2 hash with a unique, random salt
 * uses the native Web Crypto API
 */
async function hashPassword(password: string): Promise<string> {

    const encoder = new TextEncoder();

    // generate a unique, random 16-byte salt for this user
    const saltBuffer = crypto.getRandomValues(new Uint8Array(16));
    
    // import the password as a cryptographic master key
    const baseKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
    );
    
    // calculate the secure PBKDF2 hash
    const hashBuffer = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: saltBuffer,
            iterations: ITERATIONS,
            hash: "SHA-256"
        },
        baseKey,
        256 // 256 Bits = 32 bytes key length for SHA-256
    );
    
    // convert salt and hash to hex strings
    const saltHex = Array.from(saltBuffer).map(b => b.toString(16).padStart(2, "0")).join("");
    const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
    
    return `${saltHex}$${hashHex}`;
}

/**
 * verifies a given password against a stored "salt$hash"-String
 */
async function verifyPassword(passwordPlain: string, storedPasswordHash: string): Promise<boolean> {

    const parts = storedPasswordHash.split("$");
    if (parts.length !== 2) return false;
    
    const [saltHex, originalHashHex] = parts;
    const encoder = new TextEncoder();
    
    // reconstruct the salt of the user from the hex string
    const saltBuffer = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    
    // import the password to be verified
    const baseKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(passwordPlain),
        "PBKDF2",
        false,
        ["deriveBits"]
    );
    
    // calculate the hash for the entered password with the same salt
    const verifyBuffer = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: saltBuffer,
            iterations: ITERATIONS,
            hash: "SHA-256"
        },
        baseKey,
        256
    );
    
    const verifyHashHex = Array.from(new Uint8Array(verifyBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
    
    return originalHashHex === verifyHashHex;
}

function validateUsername(username: string): boolean {
    const clean = username.trim();
    return clean.length >= 3 && clean.length <= 32 && /^[a-zA-Z0-9_]+$/.test(clean);
}

@endpoint
export class AuthEndpoint {

    @property
    static async registerUser(username: string, passwordPlain: string): Promise<any> {
        const cleanUsername = username.trim();
        if (cleanUsername === "" || passwordPlain.length < 6) return { success: false, error: "Invalid input length" };
        if (!validateUsername(cleanUsername)) return { success: false, error: "Username contains invalid characters" };
        if (StoredUser.usernameExists(cleanUsername)) return { success: false, error: "Username already exists" };

        const passwordHash = await hashPassword(passwordPlain);
        const generatedId = crypto.randomUUID();

        StoredUser.init({
            id: generatedId,
            username: cleanUsername,
            passwordHash,
            surveyIds: []
        });

        return { success: true, userId: generatedId };
    }

    @property
    static async verifyUserLogin(username: string, passwordPlain: string): Promise<any> {
        const cleanUsername = username.trim();
        if (!StoredUser.usernameExists(cleanUsername)) return { success: false, error: "Login failed" };

        try {
            const user = StoredUser.getByUsername(cleanUsername);

            const isPasswordCorrect = await verifyPassword(passwordPlain, user._passwordHash);

            if (isPasswordCorrect) {
                return { success: true, userId: user.id, username: user.username };
            }
            return { success: false, error: "Login failed" };
        } catch {
            return { success: false, error: "Login failed" }; 
        }
    }

    @property
    static async linkSurveyToUser(userId: string, surveyId: string): Promise<boolean> {
        try {
            const user = StoredUser.getById(userId);
            if (!user) return false;

            user.addSurvey(surveyId);
            return true;
        } catch {
            return false;
        }
    }
    
    @property
    static async getUserSurveys(userId: string): Promise<string[]> {
        try {
            const user = StoredUser.getById(userId);
            if (!user) return [];
            
            return user.surveyIds || [];
        } catch {
            return [];
        }
    }
}