// editProfiles.mjs
import { API_BASE } from "../constants.mjs";
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

export async function updateAvatar(avatarUrl) {
    const profile = load("Profile");
    const username = profile?.name;
    
    if (!username) {
        console.error("No username found in profile.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auction/profiles/${username}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${load("Token")}`,
                "X-Noroff-API-Key": API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ avatar: { url: avatarUrl, alt: "User Avatar" } }),
        });

        if (!response.ok) {
            throw new Error(`Error updating avatar: ${response.status}`);
        }

        const result = await response.json();
        console.log('Avatar updated:', result);
        document.getElementById("avatarImage").src = avatarUrl;
    } catch (error) {
        console.error("Error updating avatar:", error);
    }
}

