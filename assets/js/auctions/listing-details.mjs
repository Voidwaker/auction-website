import { API_BASE, API_KEY } from "../constants.mjs";
import { load } from "../storage/storage.mjs";

/**
 * Fetches the details of a specific auction listing, including seller and bid information.
 * Updates the auction details on the page.
 * 
 * @async
 * @function fetchAuctionDetails
 * @param {string} listingId - The ID of the auction listing to fetch details for.
 * @returns {Promise<void>}
 */
export async function fetchAuctionDetails(listingId) {
    try {
        const response = await fetch(`${API_BASE}/auction/listings/${listingId}?_seller=true&_bids=true`, {
            headers: {
                "Authorization": `Bearer ${load("Token")}`,
                "X-Noroff-API-Key": API_KEY,
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

/**
 * Updates the auction details and displays them on the page, including time remaining.
 * 
 * @function updateAuctionDetails
 * @param {object} listing - The auction listing data to display.
 */
function updateAuctionDetails(listing) {
    const appElement = document.getElementById('app');
    const endsAt = new Date(listing.endsAt);
    const now = new Date();
    const timeRemaining = endsAt - now;

    let timeRemainingText = 'Auction has ended';
    if (timeRemaining > 0) {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

        timeRemainingText = `${days}d ${hours}h ${minutes}m remaining`;
    }

    appElement.innerHTML = `
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-8 text-center">
                    <h1 class="mb-4">${listing.title || "Auction Title"}</h1>
                    <img src="${listing.media && listing.media.length > 0 ? listing.media[0].url : '/images/placeholder.jpg'}" class="img-fluid mb-4 listing-image" alt="${listing.title}">
                    <p class="listing-description">${listing.description || "No description available."}</p>
                    <p class="seller-info">${listing.seller?.name || "No seller information available"}</p>
                    <p class="bids-info">Current highest bid: 0</p>
                    <p class="auction-time">${timeRemainingText}</p>
                    <div class="bid-section mt-4">
                        <input type="number" id="bidAmount" class="form-control mb-3" placeholder="Enter bid amount">
                        <button id="placeBidButton" class="btn btn-success">Place Bid</button>
                    </div>
                    <button class="btn btn-secondary mt-3" onclick="window.location.hash = '#/auctions'">Back to Auctions</button>
                </div>
            </div>
            <div class="row justify-content-center mt-4">
                <div class="col-md-8 text-center">
                    <h3>Recent Bids</h3>
                    <ul class="list-group bids-history"></ul>
                    <div class="text-center mt-3">
                        <button class="btn btn-primary mt-3 text-center" data-bs-toggle="collapse" data-bs-target="#allBids" aria-expanded="false" aria-controls="allBids">View All Bids</button>
                    </div>
                    <div class="collapse mt-3" id="allBids">
                        <ul class="list-group all-bids"></ul>
                    </div>
                </div>
            </div>
        </div>
    `;

    const placeBidButton = document.getElementById('placeBidButton');
    if (placeBidButton) {
        placeBidButton.addEventListener('click', async () => {
            const bidAmount = document.getElementById('bidAmount').value;
            if (bidAmount) {
                await placeBid(listing.id, bidAmount);
            } else {
                alert("Please enter a bid amount.");
            }
        });
    }
}

/**
 * Fetches and displays the bids for a specific auction listing.
 * Updates the current highest bid, recent bids, and all bids on the page.
 * 
 * @async
 * @function updateBidDisplay
 * @param {string} listingId - The ID of the auction listing to fetch bids for.
 * @returns {Promise<void>}
 */
export async function updateBidDisplay(listingId) {
    try {
        const response = await fetch(`${API_BASE}/auction/listings/${listingId}?_bids=true`, {
            headers: {
                "Authorization": `Bearer ${load("Token")}`,
                "X-Noroff-API-Key": API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Could not fetch bids: ${response.status}`);
        }

        const data = await response.json();
        const bids = data.data.bids;
        const bidsInfoElement = document.querySelector('.bids-info');
        const recentBidsElement = document.querySelector('.bids-history');
        const allBidsElement = document.querySelector('.all-bids');

        if (!bidsInfoElement || !recentBidsElement || !allBidsElement) {
            console.error("One or more bid display elements not found in DOM");
            return;
        }

        if (bids.length === 0) {
            bidsInfoElement.textContent = 'No bids available';
            return;
        }

        const highestBid = Math.max(...bids.map(bid => bid.amount));
        bidsInfoElement.innerHTML = `Current highest bid: $${highestBid}`;

        recentBidsElement.innerHTML = '';
        const recentBids = bids.slice(0, 5);
        recentBids.forEach(bid => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.textContent = `${bid.bidder?.name || 'Unknown'}, $${bid.amount}`;
            recentBidsElement.appendChild(listItem);
        });

        allBidsElement.innerHTML = '';
        bids.forEach(bid => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.textContent = `${bid.bidder?.name || 'Unknown'}, $${bid.amount}`;
            allBidsElement.appendChild(listItem);
        });

    } catch (error) {
        console.error('Error fetching bids:', error);
    }
}

/**
 * Places a new bid for a specific auction listing if the bid amount is higher than the current highest bid.
 * 
 * @async
 * @function placeBid
 * @param {string} listingId - The ID of the auction listing to place a bid for.
 * @param {number|string} bidAmount - The amount to bid on the auction.
 * @returns {Promise<void>}
 */
export async function placeBid(listingId, bidAmount) {
    const token = load("Token");

    if (!token) {
        alert("You need to be logged in to place a bid.");
        return;
    }

    const bidAmountNumber = Number(bidAmount);

    if (isNaN(bidAmountNumber) || bidAmountNumber <= 0) {
        alert("Please enter a valid bid amount.");
        return;
    }

    try {
        const currentHighestBid = await getCurrentHighestBid(listingId);

        if (bidAmountNumber <= currentHighestBid) {
            alert(`Your bid must be higher than the current bid of ${currentHighestBid}`);
            return;
        }

        const bidData = { amount: bidAmountNumber };
        console.log("Sending bid data:", bidData); 

        const response = await fetch(`${API_BASE}/auction/listings/${listingId}/bids`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Noroff-API-Key": API_KEY,
            },
            body: JSON.stringify(bidData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to place bid:", errorData);
            throw new Error("Failed to place bid");
        }

        alert("Bid placed successfully!");
        await updateBidDisplay(listingId);
    } catch (error) {
        console.error('Error placing bid:', error);
    }
}

/**
 * Fetches the current highest bid for a specific auction listing.
 * 
 * @async
 * @function getCurrentHighestBid
 * @param {string} listingId - The ID of the auction listing to fetch the highest bid for.
 * @returns {Promise<number>} - Returns the current highest bid or 0 if there are no bids.
 */
async function getCurrentHighestBid(listingId) {
    try {
        const response = await fetch(`${API_BASE}/auction/listings/${listingId}?_bids=true`, {
            headers: {
                "Authorization": `Bearer ${load("Token")}`,
                "X-Noroff-API-Key": API_KEY,
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







