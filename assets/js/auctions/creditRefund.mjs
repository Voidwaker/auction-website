import { API_BASE } from "../constants.mjs";
/* import { load } from "../storage/storage.mjs";

export async function refundCredits(userId, bidAmount) {
    const token = load("Token");

    try {
        const response = await fetch(`${API_BASE}/auction/profiles/${userId}/credits`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Noroff-API-Key": API_KEY,
            },
            body: JSON.stringify({ credits: bidAmount }),
        });

        if (!response.ok) {
            throw new Error("Failed to refund credits");
        }

        const data = await response.json();
        console.log("Credits refunded:", data);
    } catch (error) {
        console.error("Error refunding credits:", error);
    }
} */
