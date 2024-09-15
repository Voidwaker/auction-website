import { API_BASE, API_KEY } from "../constants.mjs";
import { load } from "../storage/storage.mjs";

export async function createAuction(title, description, endDate, mediaUrl) {
    const token = load("Token");

    if (!token) {
        alert("You need to be logged in to create an auction.");
        return;
    }

    try {
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
                media: mediaUrl ? [mediaUrl] : [],
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to create auction");
        }

        const result = await response.json();
        alert("Auction created successfully!");
        return result;
    } catch (error) {
        console.error("Error creating auction:", error);
        alert("Error creating auction. Please try again.");
    }
}
