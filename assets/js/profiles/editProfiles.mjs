import { API_BASE, API_KEY } from "../constants.mjs";
import { load } from "../storage/storage.mjs";

export async function updateUserCredits(username, credits) {
    try {
        const response = await fetch(`${API_BASE}/auction/profiles/${username}/credits`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${load("Token")}`,
                "X-Noroff-API-Key": API_KEY,
            },
            body: JSON.stringify({ credits }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update credits: ${response.status}`);
        }

        const result = await response.json();
        console.log("Credits updated:", result);
    } catch (error) {
        console.error("Error updating credits:", error);
    }
}

export async function fetchUserCredits(username) {
    try {
        const response = await fetch(`${API_BASE}/auction/profiles/${username}/credits`, {
            headers: {
                "Authorization": `Bearer ${load("Token")}`,
                "X-Noroff-API-Key": API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch credits: ${response.status}`);
        }

        const result = await response.json();
        return result.data.credits;
    } catch (error) {
        console.error("Error fetching credits:", error);
    }
}




