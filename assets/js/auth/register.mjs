import { save, load } from "../storage/storage.mjs";
import { API_BASE, API_REGISTER } from "../constants.mjs";
import { login } from "./login.mjs"; 

/**
 * Registers a new user on the auction platform.
 *
 * The user must use a valid Noroff email address ending in @stud.noroff.no or @noroff.no.
 * After successful registration, the user is automatically logged in.
 *
 * @param {string} name - The user's full name.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} [bio='No bio available'] - The user's bio (optional).
 * @param {string} [avatarUrl] - The URL to the user's avatar image (optional).
 * @returns {Promise<object>} The response data from the API if the registration is successful.
 * @throws Will throw an error if the registration or login process fails.
 */
export async function register(name, email, password, bio, avatarUrl) {
    const emailRegex = /@(stud\.noroff\.no|noroff\.no)$/;
    
    if (!emailRegex.test(email)) {
        alert("Please use a valid Noroff email address (@stud.noroff.no or @noroff.no).");
        return;
    }

    const requestBody = {
        name,
        email,
        password,
        bio: bio || 'No bio available', 
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
        console.log("Registration successful:", data);
        
        await login(email, password);

        return data;
    } catch (error) {
        console.error("Error while registering:", error);
        throw error;
    }
}















