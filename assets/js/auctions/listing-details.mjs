import { API_BASE } from "../constants.mjs";
import { load } from "../storage/storage.mjs";

export async function fetchAuctionDetails(listingId) {
    try {
        const response = await fetch(`${API_BASE}/auction/listings/${listingId}?_seller=true&_bids=true`, {
            headers: {
                "Authorization": `Bearer ${load("Token")}`,
                "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Could not fetch auction details: ${response.status}`);
        }

        const data = await response.json();
        updateAuctionDetails(data.data); 
        return data.data;
    } catch (error) {
        console.error('Error fetching auction details:', error);
    }
}

function updateAuctionDetails(listing) {
    const titleElement = document.querySelector('.listing-title');
    const imageElement = document.querySelector('.listing-image');
    const descriptionElement = document.querySelector('.listing-description');
    const sellerInfoElement = document.querySelector('.seller-info');

    titleElement.textContent = listing.title || "Auction Title";
    descriptionElement.textContent = listing.description || "No description available.";
    sellerInfoElement.textContent = listing.seller?.name || "No seller information available";

    if (listing.media && listing.media.length > 0) {
        imageElement.src = listing.media[0].url;
        imageElement.alt = listing.media[0].alt || "Auction Image";
    } else {
        imageElement.src = "/images/placeholder.jpg"; 
    }
}

export async function updateBidDisplay(listingId) {
    try {
        const response = await fetch(`${API_BASE}/auction/listings/${listingId}?_bids=true`, {
            headers: {
                "Authorization": `Bearer ${load("Token")}`,
                "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Could not fetch bids: ${response.status}`);
        }

        const data = await response.json();
        const bids = data.data.bids;
        const bidsInfoElement = document.querySelector('.bids-info');

        if (bids.length === 0) {
            bidsInfoElement.textContent = 'No bids available';
        } else {
            const highestBid = Math.max(...bids.map(bid => bid.amount));
            bidsInfoElement.innerHTML = `Current highest bid: ${highestBid}`;
        }
    } catch (error) {
        console.error('Error fetching bids:', error);
    }
}

export async function placeBid(listingId, bidAmount) {
    const token = load("Token");

    if (!token) {
        alert("You need to be logged in to place a bid.");
        return;
    }

    try {
        const currentHighestBid = await getCurrentHighestBid(listingId);

        if (bidAmount <= currentHighestBid) {
            alert(`Your bid must be higher than the current bid of ${currentHighestBid}`);
            return;
        }

        const response = await fetch(`${API_BASE}/auction/listings/${listingId}/bids`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
            },
            body: JSON.stringify({ amount: bidAmount }),
        });

        if (!response.ok) {
            throw new Error("Failed to place bid");
        }

        alert("Bid placed successfully!");
        await updateBidDisplay(listingId); 
    } catch (error) {
        console.error('Error placing bid:', error);
    }
}

async function getCurrentHighestBid(listingId) {
    try {
        const response = await fetch(`${API_BASE}/auction/listings/${listingId}?_bids=true`, {
            headers: {
                "Authorization": `Bearer ${load("Token")}`,
                "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Could not fetch bids: ${response.status}`);
        }

        const data = await response.json();
        const bids = data.data.bids;
        return bids.length > 0 ? Math.max(...bids.map(bid => bid.amount)) : 0;
    } catch (error) {
        console.error('Error fetching bids:', error);
        return 0;
    }
}




