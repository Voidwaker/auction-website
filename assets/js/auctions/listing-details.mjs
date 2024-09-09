import { API_BASE } from "../constants.mjs";
import { load } from "../storage/storage.mjs";

export async function fetchAuctionBids(listingId) {
    try {
        const response = await fetch(`${API_BASE}/auction/listings/${listingId}/bids`, {
            headers: {
                "Authorization": `Bearer ${load("Token")}`,
                "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch bids");
        }

        const result = await response.json();
        return result.data; 
    } catch (error) {
        console.error("Error fetching bids:", error);
    }
}

export async function updateBidDisplay(listingId) {
    const bids = await fetchAuctionBids(listingId);
    const bidsElement = document.querySelector(".bids-info");

    if (bids.length === 0) {
        bidsElement.textContent = "Ingen bud tilgjengelig.";
        return;
    }

    let bidsHtml = `<ul class="list-group">`;
    bids.forEach(bid => {
        bidsHtml += `
            <li class="list-group-item">
                Budgiver: ${bid.bidder.name} - Beløp: ${bid.amount} - Dato: ${new Date(bid.created).toLocaleString()}
            </li>
        `;
    });
    bidsHtml += `</ul>`;

    bidsElement.innerHTML = bidsHtml;
}

export async function placeBid(listingId, bidAmount) {
    try {
        const response = await fetch(`${API_BASE}/auction/listings/${listingId}/bids`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${load("Token")}`,
                "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
            },
            body: JSON.stringify({ amount: bidAmount }),
        });

        if (!response.ok) {
            const responseData = await response.json();
            console.error("Server error:", responseData);
            throw new Error("Failed to place bid");
        }

        alert("Bud lagt inn!");
        return await response.json();
    } catch (error) {
        console.error("Error placing bid:", error);
    }
}

