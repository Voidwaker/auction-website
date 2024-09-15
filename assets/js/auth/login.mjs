import { save } from "../storage/storage.mjs";
import { API_BASE, API_LOGIN } from "../constants.mjs";

export async function login(email, password) {
    try {

        const response = await fetch(`${API_BASE}${API_LOGIN}`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        console.log("Login response:", response); 

        if (response.ok) {

            const { accessToken, ...profile } = (await response.json()).data;

            save("Token", accessToken);
            save("Profile", profile);

            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (modal) {
                modal.hide();
            }

            console.log("Redirecting to profile...");

            window.location.hash = "#/profile"; 

            console.log("Hash set to: ", window.location.hash);

            return profile;
        } else {

            const errorData = await response.json();
            console.error("Error response from server:", errorData);
        }
    } catch (error) {
        console.error("Failed to login:", error); 
    }

    throw new Error("Failed to login");
}






