import { save } from "../storage/storage.mjs";

export function logout() {
    localStorage.removeItem("Token");
    localStorage.removeItem("Profile");
    window.location.href = "/index.html";
} 