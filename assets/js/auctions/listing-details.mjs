import { API_BASE } from '../constants.mjs';
import { load } from '../storage/storage.mjs';

export async function fetchAuctionDetails(listingId) {
    try {
        const response = await fetch(`${API_BASE}/auction/listings/${listingId}`);
        const data = (await response.json()).data;

        const titleElement = document.querySelector('.listing-title');
        const descriptionElement = document.querySelector('.listing-description');
        const sellerInfoElement = document.querySelector('.seller-info');
        const bidsElement = document.querySelector('.bids-info');
        const imageElement = document.querySelector('.listing-image');

        titleElement.textContent = data.title || 'No title available';
        descriptionElement.textContent = data.description || 'No description available';

        const sellerName = data.seller?.name || 'Unknown seller';
        sellerInfoElement.textContent = `Seller: ${sellerName}`;

        const imageUrl = data.media?.length > 0 ? data.media[0].url : '/images/placeholder.jpg';
        const imageAlt = data.media?.length > 0 ? data.media[0].alt : 'No image available';
        imageElement.src = imageUrl;
        imageElement.alt = imageAlt;

        if (data.bids && data.bids.length > 0) {
            let bidsContent = '<ul>';
            data.bids.forEach(bid => {
                bidsContent += `<li>${bid.bidder.name}: ${bid.amount}</li>`;
            });
            bidsContent += '</ul>';
            bidsElement.innerHTML = bidsContent;
        } else {
            bidsElement.textContent = 'No bids available.';
        }

    } catch (error) {
        console.error('Error fetching auction details:', error);
    }
}

export async function placeBid(listingId, amount) {
    const token = load('Token');

    if (!token) {
        alert('You must be logged in to place a bid');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auction/listings/${listingId}/bids`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Noroff-API-Key': import.meta.env.VITE_API_KEY,
            },
            body: JSON.stringify({ amount: parseFloat(amount) })
        });

        if (!response.ok) {
            throw new Error('Failed to place bid');
        }

        alert('Bid placed successfully');
        fetchAuctionDetails(listingId); 
    } catch (error) {
        console.error('Error placing bid:', error);
    }
}
