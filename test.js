// API-konstanter
export const API_KEY = "233a5a18-686a-429b-864d-e65aa63b89da";
export const API_BASE = "https://v2.api.noroff.dev";
export const API_AUTH = "/auth";
export const API_REGISTER = "/register";
export const API_LOGIN = "/login";
export const API_KEY_URL = "/create-api-key";
export const API_AUCTION = "/auction";
export const API_LISTINGS_BASE = "/listings";
export const ALL_LISTINGS_URL = `${API_BASE}${API_AUCTION}${API_LISTINGS_BASE}`;

// Lagre og hente fra localStorage
export function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value)); 
}

export function load(key) {
    return JSON.parse(localStorage.getItem(key));
}

// Få API-nøkkel
export async function getApiKey() {
    try {
        const response = await fetch(API_BASE + API_AUTH + API_KEY_URL, {
            method: "POST", 
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${load("Token")}`,
            },
            body: JSON.stringify({ name: "test key" })
        });
        const data = await response.json();
        console.log(data);  
    } catch (error) {
        console.error('Error fetching API Key', error);
    }
}

// Registrer en ny bruker
export async function register(name, email, password) {
    const response = await fetch(API_BASE + API_AUTH + API_REGISTER, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
        return await response.json();
    }
    throw new Error("Failed to register account");
}

// Logg inn bruker
export async function login(email, password) {
    const response = await fetch(API_BASE + API_AUTH + API_LOGIN, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const { accessToken, ...profile } = (await response.json()).data;
        save("Token", accessToken);
        save("Profile", profile);
        return profile;
    }

    throw new Error("Failed to login");
}

// handle login and registration
export async function onAuth(event) {
    event.preventDefault(); 
    const form = event.target;

    const name = form.elements['registerName']?.value || "";
    const email = form.elements['loginEmail']?.value || form.elements['registerEmail']?.value;
    const password = form.elements['loginPassword']?.value || form.elements['registerPassword']?.value;

    if (event.submitter.textContent.trim() === "Log In") {
        await login(email, password);
    } else {
        await register(name, email, password);
        await login(email, password); 
    }
}

// event listner for form
export function setAuthListeners() {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    if (registerForm) {
        registerForm.addEventListener("submit", onAuth);
    }

    if (loginForm) {
        loginForm.addEventListener("submit", onAuth);
    }
}

// **Ny kortbasert visning - erstatter karusellen** for å vise alle auksjoner
export async function fetchAndDisplayListings() {
    try {
        const response = await fetch(ALL_LISTINGS_URL);
        const result = await response.json();

        console.log(result);  

        
        const listings = result.data || result;

        
        if (Array.isArray(listings)) {
            const auctionList = document.getElementById('auction-list');
            if (!auctionList) {
                throw new Error('Element with id "auction-list" not found in the DOM');
            }

            auctionList.innerHTML = ''; 

            listings.forEach(listing => {
                const auctionCard = document.createElement('div');
                auctionCard.classList.add('col-md-4', 'mb-4');

                auctionCard.innerHTML = `
    <div class="card h-100">
        <img src="${listing.media[0]?.url || '/images/placeholder.jpg'}" class="card-img-top" alt="${listing.title}">
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


// **Vis detaljene for en auksjon**
const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get('id'); 

if (listingId) {
    const url = `${API_BASE}${API_AUCTION}${API_LISTINGS_BASE}/${listingId}?_seller=true&_bids=true`;

    fetch(url)
        .then(response => response.json())
        .then(listing => {
            const titleElement = document.querySelector('.listing-title');
            if (titleElement) {
                titleElement.textContent = listing.title;
            }

            const imageElement = document.querySelector('.listing-image');
            if (imageElement) {
                imageElement.src = listing.media.length > 0 ? listing.media[0].url : '/images/placeholder.jpg';
                imageElement.alt = listing.media.length > 0 ? listing.media[0].alt || listing.title : 'No image available';
            }

            const descriptionElement = document.querySelector('.listing-description');
            if (descriptionElement) {
                descriptionElement.textContent = listing.description || 'No description available.';
            }

            const sellerInfoElement = document.querySelector('.seller-info');
            if (sellerInfoElement) {
                sellerInfoElement.textContent = listing.seller ? `Seller: ${listing.seller.name}` : 'Seller info not available';
            }

            const bidsInfoElement = document.querySelector('.bids-info');
            if (bidsInfoElement) {
                bidsInfoElement.textContent = listing.bids.length > 0
                    ? listing.bids.map(bid => `Bid by ${bid.bidder.name}: ${bid.amount}`).join(', ')
                    : 'No bids available.';
            }
        })
        .catch(error => {
            console.error('Error fetching the listing details:', error);
        });
} else {
    const titleElement = document.querySelector('.listing-title');
    if (titleElement) {
        titleElement.textContent = 'Listing was not found';
    }

    const descriptionElement = document.querySelector('.listing-description');
    if (descriptionElement) {
        descriptionElement.textContent = 'Oops! An invalid listing ID.';
    }
}

// Kall funksjonene når DOM-en er lastet
document.addEventListener("DOMContentLoaded", () => {
    setAuthListeners();
    fetchAndDisplayListings();
    getApiKey();  
});
