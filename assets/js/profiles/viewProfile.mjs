import { load } from "../storage/storage.mjs";
import { fetchUserCredits } from "./editProfiles.mjs"; 
import { API_BASE } from "../constants.mjs";

export async function updateCreditDisplay() {
    const profile = load("Profile");
    const username = profile?.name;

    if (username) {
        const credits = await fetchUserCredits(username);
        const creditElement = document.getElementById("profileCredits");
        
        if (creditElement) {
            creditElement.textContent = `Credits: ${credits}`;
        } else {
            console.error("Element with id 'profileCredits' not found.");
        }
    }
}

export async function updateBioDisplay() {
    const profile = load("Profile");
    const bio = profile?.bio || "No bio available";
    const bioElement = document.getElementById("profileBio");

    if (bioElement) {
        bioElement.textContent = bio;
    } else {
        console.error("Element with id 'profileBio' not found.");
    }
}

export function updateProfileName() {
    const profile = load("Profile");
    const username = profile?.name || "Unknown User";
    const nameElement = document.getElementById("profileName");
    
    if (nameElement) {
        nameElement.textContent = username;
    } else {
        console.error("Element with id 'profileName' not found.");
    }
}

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
                "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
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
    }
}

export async function updateAvatar(newAvatarUrl) {
    const token = load("Token");
    const profile = load("Profile");

    if (!token || !profile) {
        alert("You need to be logged in to update your avatar.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auction/profiles/${profile.name}/media`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
            },
            body: JSON.stringify({ avatar: newAvatarUrl }),
        });

        if (!response.ok) {
            throw new Error("Failed to update avatar");
        }

        const result = await response.json();
        alert("Avatar updated successfully!");
        return result;
    } catch (error) {
        console.error("Error updating avatar:", error);
    }
}





