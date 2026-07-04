import { StoredUser } from "common/auth/users.ts";


//TODO: replace with actual password hashing algorithm
async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "SichererSalt2026");
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
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
            const inputHash = await hashPassword(passwordPlain);

            if (user._passwordHash === inputHash) {
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