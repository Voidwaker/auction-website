import { save } from "../storage/storage.mjs";
import { API_BASE, API_LOGIN } from "../constants.mjs";

export async function login(email, password) {
    const response = await fetch(`${API_BASE}${API_LOGIN}`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const { accessToken, ...profile } = (await response.json()).data;
        save("Token", accessToken);
        save("Profile", profile);
        window.location.href = "/pages/profile.html";
        return profile;
    }

    throw new Error("Failed to login");
}

