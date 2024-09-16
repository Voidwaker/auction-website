import { save, load } from "../storage/storage.mjs";
import { API_BASE, API_REGISTER } from "../constants.mjs";
import { login } from "./login.mjs"; 

export async function register(name, email, password, bio, avatarUrl) {
    // Vi sørger for å sende bio selv om den er tom
    const requestBody = {
        name,
        email,
        password,
        bio: bio || 'No bio available',  // Setter en standard hvis bio er tom
    };

    // Hvis det er en avatar-URL, legger vi den også til
    if (avatarUrl) {
        requestBody.avatar = {
            url: avatarUrl,
            alt: "User Avatar"
        };
    }

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
        console.log("Registration successful:", data);

        // Logg inn brukeren automatisk etter registrering
        await login(email, password);

        return data;
    } catch (error) {
        console.error("Feil ved registrering:", error);
        throw error;
    }
}













