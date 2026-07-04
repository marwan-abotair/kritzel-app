const savedId = typeof localStorage !== "undefined" ? localStorage.getItem("kritzel_user_id") : null;
const savedName = typeof localStorage !== "undefined" ? localStorage.getItem("kritzel_user_name") : null;

export class AppState {
    static readonly currentUserId = $<string | null>(savedId);
    static readonly currentUsername = $<string | null>(savedName);

    static setSession(user: { id: string; username: string }) {
        this.currentUserId.val = user.id;
        this.currentUsername.val = user.username;
        
        if (typeof localStorage !== "undefined") {
            localStorage.setItem("kritzel_user_id", user.id);
            localStorage.setItem("kritzel_user_name", user.username);
        }
    }

    static clearSession() {
        this.currentUserId.val = null;
        this.currentUsername.val = null;

        if (typeof localStorage !== "undefined") {
            localStorage.removeItem("kritzel_user_id");
            localStorage.removeItem("kritzel_user_name");
        }
    }
}