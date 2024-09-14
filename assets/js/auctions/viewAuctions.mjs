import { ALL_LISTINGS_URL } from "../constants.mjs";

export async function fetchAndDisplayListings() {
    try {
        const response = await fetch(ALL_LISTINGS_URL);
        const result = await response.json();

        const listings = result.data || result;
        if (Array.isArray(listings)) {
            const auctionList = document.getElementById('auction-list');
            if (!auctionList) {
                throw new Error('Element med id "auction-list" ikke funnet i DOM');
            }

            auctionList.innerHTML = '';

            listings.forEach(listing => {
                const auctionCard = document.createElement('div');
                auctionCard.classList.add('col-md-4', 'mb-4');

                auctionCard.innerHTML = `
                    <div class="card h-100">
                        <img src="${listing.media.length > 0 ? listing.media[0].url : '/images/placeholder.jpg'}" class="card-img-top" alt="${listing.title}">
                        <div class="card-body">
                            <h5 class="card-title">${listing.title}</h5>
                            <p class="card-text">${listing.description || 'Ingen beskrivelse tilgjengelig.'}</p>
                            <a href="/pages/listing-details.html?id=${listing.id}" class="btn btn-primary">Se auksjon</a>
                        </div>
                    </div>
                `;

                auctionList.appendChild(auctionCard);  
            });
        } else {
            console.error('Listings er ikke en array:', listings);
        }
    } catch (error) {
        console.error('Feil ved henting av auksjoner', error);
    }
}

export function filterAuctions(searchTerm) {
    const auctionList = document.getElementById('auction-list');
    const auctionCards = auctionList.querySelectorAll('.card');

    auctionCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const description = card.querySelector('.card-text').textContent.toLowerCase();

        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.parentElement.style.display = '';
        } else {
            card.parentElement.style.display = 'none';
        }
    });
}


