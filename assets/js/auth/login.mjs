import { save } from "../storage/storage.mjs";
import { API_BASE, API_LOGIN, API_KEY } from "../constants.mjs";

export async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE}${API_LOGIN}`, {
            headers: { 
                "Content-Type": "application/json",
                "X-Noroff-API-Key": API_KEY  
            },
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Login failed: ${errorData.errors[0].message || response.statusText}`);
        }

        const { accessToken, ...profile } = (await response.json()).data;

        save("Token", accessToken);
        save("Profile", profile);

        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (modal) {
            modal.hide();
        }

        window.location.hash = "#/profile"; 
        return profile;
    } catch (error) {
        console.error("Login error:", error);
        alert(error.message); 
    }
}










