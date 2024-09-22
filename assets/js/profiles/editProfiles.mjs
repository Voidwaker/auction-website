import { API_BASE, API_KEY } from "../constants.mjs";
import { load } from "../storage/storage.mjs";

/**
 * Updates the user's credits in the profile.
 * 
 * This function sends a PUT request to the API to update the user's credits.
 * 
 * @async
 * @function updateUserCredits
 * @param {string} username - The username of the user whose credits are being updated.
 * @param {number} credits - The number of credits to update the user's profile with.
 * @returns {Promise<void>}
 */
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

/**
 * Fetches the user's credits from the profile.
 * 
 * This function sends a GET request to the API to retrieve the user's current credits.
 * 
 * @async
 * @function fetchUserCredits
 * @param {string} username - The username of the user whose credits are being fetched.
 * @returns {Promise<number>} The number of credits the user has.
 */
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








