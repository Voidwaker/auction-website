import { ALL_LISTINGS_URL } from "../constants.mjs";

export async function fetchAndDisplayListings(searchTerm = '') {
    const auctionList = document.getElementById('auction-list');
    if (!auctionList) {
        console.error('Element med id "auction-list" ikke funnet i DOM');
        return;
    }

    try {
        const response = await fetch(ALL_LISTINGS_URL);
        const result = await response.json();
        const listings = result.data || result;

        if (Array.isArray(listings)) {
            auctionList.innerHTML = '';

            const filteredListings = listings.filter(listing => {
                const title = listing.title.toLowerCase();
                const description = listing.description ? listing.description.toLowerCase() : '';
                return title.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase());
            });

            if (filteredListings.length === 0) {
                auctionList.innerHTML = '<p>Ingen auksjoner funnet.</p>';
            } else {
                filteredListings.forEach(listing => {
                    const auctionCard = document.createElement('div');
                    auctionCard.classList.add('col-md-4', 'mb-4');

                    auctionCard.innerHTML = `
                        <div class="card h-100">
                            <img src="${listing.media.length > 0 ? listing.media[0].url : '/images/placeholder.jpg'}" class="card-img-top" alt="${listing.title}">
                            <div class="card-body">
                                <h5 class="card-title">${listing.title}</h5>
                                <p class="card-text">${listing.description || 'Ingen beskrivelse tilgjengelig.'}</p>
                                <a href="#/listing-details?id=${listing.id}" class="btn btn-primary">View auction</a>
                            </div>
                        </div>
                    `;

                    auctionList.appendChild(auctionCard);
                });
            }
        } else {
            console.error('Listings er ikke en array:', listings);
        }
    } catch (error) {
        console.error('Feil ved henting av auksjoner:', error);
    }
}

export function setupSearchHandler() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value;
        fetchAndDisplayListings(searchTerm);
    });
}






