import { StoredUser } from "common/auth/users.ts";


function validateUsername(username: string): boolean {
    const clean = username.trim();
    return clean.length >= 3 && clean.length <= 32 && /^[a-zA-Z0-9_]+$/.test(clean);
}

export async function registerUser(username: string, passwordPlain: string): Promise<boolean> {
    const cleanUsername = username.trim();
    if (cleanUsername === "" || passwordPlain.length < 6) return false;
    if (!validateUsername(cleanUsername)) return false;
    if (StoredUser.usernameExists(cleanUsername)) return false;

    // TODO: use a deno crypto library for actual password hashing (e.g. Argon2/scrypt)
    // a placeholder hash is sufficient to test the flow
    const encoder = new TextEncoder();
    const data = encoder.encode(passwordPlain + "SichererSalt2026");
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const passwordHash = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

    const generatedId = crypto.randomUUID();

    StoredUser.init({
        id: generatedId,
        username: cleanUsername,
        passwordHash: passwordHash,
        surveyIds: []
    });

    return true;
}

export async function verifyUserLogin(username: string, passwordPlain: string): Promise<boolean> {
    const cleanUsername = username.trim();
    if (!StoredUser.usernameExists(cleanUsername)) return false;

    try {
        const user = StoredUser.getByUsername(cleanUsername);
        
        // same hashing process as before to compare the hashes
        const encoder = new TextEncoder();
        const data = encoder.encode(passwordPlain + "SichererSalt2026");
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const inputHash = Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");

        return user._passwordHash === inputHash;
    } catch {
        return false;
    }
}

