// register.mjs
import { save } from "../storage/storage.mjs";
import { API_BASE, API_REGISTER } from "../constants.mjs";
import { updateUserCredits } from "../profiles/editProfiles.mjs";

export async function register(name, email, password, bio, avatarUrl) {
    const requestBody = {
        name,
        email,
        password,
        bio: bio || '', 
    };

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
        console.log("Bruker registrert:", data);
        await updateUserCredits(data.name, 1000);
        return data;
    } catch (error) {
        console.error("Feil ved registrering:", error);
        throw error;
    }
}
