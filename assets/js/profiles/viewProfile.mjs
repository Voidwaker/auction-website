import { load } from "../storage/storage.mjs";
import { API_BASE } from "../constants.mjs";

// Oppdater kredittvisning på profilsiden
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

// Oppdater visning av bio på profilsiden
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

// Oppdater visning av brukernavn på profilsiden
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

// Funksjon for å opprette en auksjon
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

// Legg til event listener for auksjonsoppretting på profilsiden
const createAuctionForm = document.getElementById("createAuctionForm");
if (createAuctionForm) {
    createAuctionForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const title = document.getElementById("auctionTitle").value;
        const description = document.getElementById("auctionDescription").value;
        const endDate = document.getElementById("auctionEndDate").value;
        const mediaUrl = document.getElementById("auctionMedia").value;
        await createAuction(title, description, endDate, mediaUrl);
    });
}


