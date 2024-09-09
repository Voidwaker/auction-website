// viewAuctions.mjs
import { ALL_LISTINGS_URL } from "../constants.mjs";

export async function fetchAndDisplayListings() {
    try {
        const response = await fetch(ALL_LISTINGS_URL);
        const result = await response.json();

        const listings = result.data || result;
        if (Array.isArray(listings)) {
            const auctionList = document.getElementById('auction-list');
            if (!auctionList) {
                throw new Error('Element with id "auction-list" not found in the DOM');
            }

            auctionList.innerHTML = '';  // Clear existing content

            listings.forEach(listing => {
                const auctionCard = document.createElement('div');
                auctionCard.classList.add('col-md-4', 'mb-4');

                auctionCard.innerHTML = `
                    <div class="card h-100">
                        <img src="${listing.media.length > 0 ? listing.media[0].url : '/images/placeholder.jpg'}" class="card-img-top" alt="${listing.title}">
                        <div class="card-body">
                            <h5 class="card-title">${listing.title}</h5>
                            <p class="card-text">${listing.description || 'No description available.'}</p>
                            <a href="/pages/listing-details.html?id=${listing.id}" class="btn btn-primary">View Auction</a>
                        </div>
                    </div>
                `;

                auctionList.appendChild(auctionCard);
            });
        } else {
            console.error('Listings is not an array:', listings);
        }
    } catch (error) {
        console.error('Error fetching the listings', error);
    }
}
