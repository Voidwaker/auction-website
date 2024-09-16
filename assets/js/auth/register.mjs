import { save } from "../storage/storage.mjs";
import { API_BASE, API_REGISTER } from "../constants.mjs";
import { updateUserCredits } from "../profiles/editProfiles.mjs";
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
            headers: { "Content-Type": "application/json" },
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

        save("Profile", data.data);

        if (data.data.name) {
            await updateUserCredits(data.data.name, 1000);  
        }

        await login(data.data.email, password);  

        const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        if (modal) {
            modal.hide();
        }

        window.location.hash = "#/profile"; 
        return data;
    } catch (error) {
        console.error("Feil ved registrering:", error);
        throw error;
    }
}








