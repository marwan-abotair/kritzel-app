const savedUser = localStorage.getItem("kritzel_user");
const initialUser = savedUser ? JSON.parse(savedUser) : null;

export class AppState {
    static readonly currentUser = $(initialUser);

    static setSession(user: { id: string, username: string }) {
        this.currentUser.val = user;
        localStorage.setItem("kritzel_user", JSON.stringify(user));
    }

    static clearSession() {
        this.currentUser.val = null;
        localStorage.removeItem("kritzel_user");
    }
}