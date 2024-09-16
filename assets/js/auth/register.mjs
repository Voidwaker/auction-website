import { save } from "../storage/storage.mjs";
import { API_BASE, API_REGISTER, API_KEY } from "../constants.mjs";
import { login } from "./login.mjs";  

export async function register(name, email, password, bio, avatarUrl, venueManager = false) {
    const requestBody = {
        name,
        email,
        password,
        bio: bio || '', 
        avatar: avatarUrl ? { url: avatarUrl, alt: "User Avatar" } : undefined,
        venueManager: venueManager 
    };

    try {
        const response = await fetch(`${API_BASE}${API_REGISTER}`, {
            headers: { 
                "Content-Type": "application/json",
                "X-Noroff-API-Key": API_KEY  
            },
            method: "POST",
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Registration failed:", errorData);
            throw new Error("Failed to register account");
        }

        const data = await response.json();
        console.log("Bruker registrert:", data);

        await login(email, password);

        return data;
    } catch (error) {
        console.error("Feil ved registrering:", error);
        throw error;
    }
}









