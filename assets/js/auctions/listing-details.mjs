import { API_BASE } from "../constants.mjs";
import { load } from "../storage/storage.mjs";

export async function fetchAuctionDetails(auctionId) {
    try {
        const response = await fetch(`${API_BASE}/auction/listings/${auctionId}`);
        const result = await response.json();

        if (result.errors) {
            throw new Error(result.errors[0].message);
        }

        document.querySelector('.listing-title').textContent = result.data.title || "No title available";
        document.querySelector('.listing-description').textContent = result.data.description || "No description available";
        
        const imageElement = document.querySelector('.listing-image');
        imageElement.src = result.data.media.length > 0 ? result.data.media[0].url : "/images/placeholder.jpg";
        imageElement.alt = result.data.media.length > 0 ? result.data.media[0].alt : "No image available";

        const sellerInfo = document.querySelector('.seller-info');
        const seller = result.data.seller;
        if (seller && seller.name) {
            sellerInfo.innerHTML = `
                <strong>Seller:</strong> ${seller.name}<br>
                <strong>Email:</strong> ${seller.email || "No email available"}<br>
                ${seller.bio ? `<strong>Bio:</strong> ${seller.bio}` : "No bio available"}
            `;
        } else {
            sellerInfo.textContent = "Seller information not available";
        }

        const bidsInfo = document.querySelector('.bids-info');
        const bids = result.data.bids;
        if (bids && bids.length > 0) {
            const highestBid = Math.max(...bids.map(bid => bid.amount));
            const highestBidder = bids.find(bid => bid.amount === highestBid)?.bidder?.name || "Unknown bidder";

            document.querySelector('.bids-info').innerHTML = `
                <strong>Current highest bid:</strong> ${highestBid} by ${highestBidder}
                <br><br>
                <strong>Bid history:</strong><br>
                ${bids.map(bid => `Bid: ${bid.amount} by ${bid.bidder.name}`).join('<br>')}
            `;
        } else {
            bidsInfo.textContent = "No bids available.";
        }
    } catch (error) {
        console.error("Error fetching auction details:", error);
    }
}

export async function placeBid(auctionId, bidAmount) {
    const token = load("Token");

    if (!token) {
        alert("You need to be logged in to place a bid.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auction/listings/${auctionId}/bids`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
            },
            body: JSON.stringify({
                amount: parseFloat(bidAmount) 
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to place bid");
        }

        const result = await response.json();
        alert("Bid placed successfully!");
        return result;
    } catch (error) {
        console.error("Error placing bid:", error);
    }
}
