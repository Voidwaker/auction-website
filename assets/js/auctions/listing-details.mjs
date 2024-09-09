import { API_BASE } from "../constants.mjs";
import { load } from "../storage/storage.mjs";

const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get("id");

export async function fetchAuctionDetails() {
    try {
        const response = await fetch(`${API_BASE}/auction/listings/${listingId}?_bids=true&_seller=true`, {
            headers: {
                "Authorization": `Bearer ${load("Token")}`,
                "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
            }
        });

        const listing = await response.json();

        document.querySelector('.listing-title').textContent = listing.title;
        document.querySelector('.listing-description').textContent = listing.description;
        document.querySelector('.listing-image').src = listing.media?.[0]?.url || "/images/placeholder.jpg";

        updateBidDisplay(listing.bids);
    } catch (error) {
        console.error("Error fetching auction details:", error);
    }
}

export async function updateBidDisplay(bids) {
    const bidsElement = document.querySelector('.bids-info');

    if (bids && bids.length > 0) {
        bidsElement.innerHTML = bids.map(bid => `<p>${bid.bidder.name} bød ${bid.amount}</p>`).join('');
    } else {
        bidsElement.textContent = "No bids available.";
    }
}

export async function placeBid(bidAmount) {
    try {
        const amount = Number(bidAmount);

        if (isNaN(amount)) {
            throw new Error("Invalid bid amount. Please enter a valid number.");
        }

        const response = await fetch(`${API_BASE}/auction/listings/${listingId}/bids`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${load("Token")}`,
                "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: amount, 
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to place bid");
        }

        const result = await response.json();
        alert("Bid placed successfully!");
        updateBidDisplay(result.bids);
    } catch (error) {
        console.error("Error placing bid:", error);
    }
}



