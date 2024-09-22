import { API_BASE, API_KEY } from "../constants.mjs";
import { load } from "../storage/storage.mjs";

/**
 * Creates a new auction with the given title, description, end date, and optional media URL.
 *
 * @param {string} title - The title of the auction.
 * @param {string} description - A brief description of the auction.
 * @param {string} endDate - The date and time when the auction will end (ISO 8601 format).
 * @param {string} [mediaUrl] - An optional URL pointing to an image for the auction.
 * @returns {Promise<object>} The created auction object if successful.
 * @throws Will throw an error if the auction creation fails.
 */
export async function createAuction(title, description, endDate, mediaUrl) {
    const token = load("Token");

    if (!token) {
        alert("You need to be logged in to create an auction.");
        return;
    }

    try {
        const mediaArray = mediaUrl ? [{ url: mediaUrl }] : [];

        console.log("Sending auction data:", {
            title,
            description,
            endsAt: endDate,
            media: mediaArray
        });

        const response = await fetch(`${API_BASE}/auction/listings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Noroff-API-Key": API_KEY,
            },
            body: JSON.stringify({
                title,
                description,
                endsAt: endDate,
                media: mediaArray, 
            }),
        });

        const result = await response.json();
        console.log("API response:", result);

        if (!response.ok) {
            console.error("Error response from API:", result);
            throw new Error("Failed to create auction");
        }

        alert("Auction created successfully!");
        return result;
    } catch (error) {
        console.error("Error creating auction:", error);
        alert("Error creating auction. Please try again.");
    }
}

