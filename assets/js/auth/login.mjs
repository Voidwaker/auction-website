import { save } from "../storage/storage.mjs";
import { API_BASE, API_LOGIN } from "../constants.mjs";

export async function login(email, password) {
    const response = await fetch(`${API_BASE}${API_LOGIN}`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    console.log(response);

    if (response.ok) {
        const { accessToken, ...profile } = (await response.json()).data;
        save("Token", accessToken);
        save("Profile", profile);

        window.location.hash = "#/profile";
        return profile;
    } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
    }

    throw new Error("Failed to login");
}



