// Definer API-konstanter
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
        console.log(data);  // Logg API-nøkkel for testing
    } catch (error) {
        console.error('Error fetching API Key', error);
    }
}

// Funksjon for å registrere ny bruker med 1000 kreditter
export async function register(name, email, password, bio, avatarUrl) {
    const requestBody = {
        name,
        email,
        password,
        bio: bio || '', // Legg til bio hvis den er oppgitt, ellers tom
    };

    // Inkluder avatar-URL hvis den er oppgitt
    if (avatarUrl) {
        requestBody.avatar = {
            url: avatarUrl,
            alt: "User Avatar"
        };
    }

    try {
        const response = await fetch(API_BASE + API_AUTH + API_REGISTER, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Registration failed:", errorData);
            throw new Error("Failed to register account");
        }

        const data = await response.json();
        console.log("Bruker registrert:", data);
        await updateUserCredits(data.name, 1000);
        return data;
    } catch (error) {
        console.error("Feil ved registrering:", error);
        throw error;
    }
}

// Logg inn bruker og omdiriger til profilside
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
        window.location.href = "/pages/profile.html";  // Omdiriger til profilsiden etter innlogging
        return profile;
    }

    throw new Error("Failed to login");
}

// Oppdater brukerens kreditter etter registrering
async function updateUserCredits(username, credits) {
    try {
        const response = await fetch(`${API_BASE}/auction/profiles/${username}/credits`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${load("Token")}`,
                "X-Noroff-API-Key": API_KEY,
            },
            body: JSON.stringify({ credits }),
        });

        if (!response.ok) {
            throw new Error(`Kunne ikke oppdatere kreditter: ${response.status}`);
        }

        const result = await response.json();
        console.log('Kreditter oppdatert:', result);
    } catch (error) {
        console.error("Feil ved oppdatering av kreditter:", error);
    }
}

// Hent brukerens kreditter
async function fetchUserCredits(username) {
    try {
        const response = await fetch(`${API_BASE}/auction/profiles/${username}/credits`, {
            headers: {
                "Authorization": `Bearer ${load("Token")}`,
                "X-Noroff-API-Key": API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Kunne ikke hente kreditter: ${response.status}`);
        }

        const result = await response.json();
        console.log('Brukerkreditter:', result);
        return result.data.credits;
    } catch (error) {
        console.error("Feil ved henting av kreditter:", error);
    }
}

// Oppdater kredittvisning på profilsiden
async function updateCreditDisplay() {
    const profile = load("Profile");
    const username = profile?.name;

    if (username) {
        const credits = await fetchUserCredits(username);
        const creditElement = document.getElementById("profileCredits");
        
        if (creditElement) {
            creditElement.textContent = `Credits: ${credits}`;
        } else {
            console.error("Element with id 'profileCredits' not found.");
        }
    }
}

// Oppdater visning av bio på profilsiden
async function updateBioDisplay() {
    const profile = load("Profile");
    const bio = profile?.bio || "No bio available";
    const bioElement = document.getElementById("profileBio");

    if (bioElement) {
        bioElement.textContent = bio;
    } else {
        console.error("Element with id 'profileBio' not found or no bio available.");
    }
}

// Oppdater avatar funksjon
async function updateAvatar(avatarUrl) {
    const profile = load("Profile");
    const username = profile?.name;
    
    if (!username) {
        console.error("No username found in profile.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auction/profiles/${username}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${load("Token")}`,
                "X-Noroff-API-Key": API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ avatar: { url: avatarUrl, alt: "User Avatar" } }),
        });

        if (!response.ok) {
            throw new Error(`Error updating avatar: ${response.status}`);
        }

        const result = await response.json();
        console.log('Avatar oppdatert:', result);
        document.getElementById("avatarImage").src = avatarUrl;
    } catch (error) {
        console.error("Error updating avatar:", error);
    }
}

// Legg til event listeners for skjemaer
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

// Håndter innlogging og registrering
export async function onAuth(event) {
    event.preventDefault(); 
    const form = event.target;

    const name = form.elements['registerName']?.value || "";
    const email = form.elements['registerEmail']?.value || form.elements['loginEmail']?.value;
    const password = form.elements['loginPassword']?.value || form.elements['registerPassword']?.value;
    const bio = form.elements['registerBio']?.value || "";  // Hent bio
    const avatarUrl = form.elements['registerAvatarUrl']?.value || "";  // Hent avatar-URL

    if (event.submitter.textContent.trim() === "Log In") {
        await login(email, password);
    } else {
        await register(name, email, password, bio, avatarUrl);
        await login(email, password);  // Logg inn brukeren etter registrering
    }
}

// Log out-funksjon og andre nødvendige funksjoner
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");
    const updateAvatarButton = document.getElementById("updateAvatarButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("Token");
            localStorage.removeItem("Profile");
            window.location.href = "/index.html"; 
        });
    }

    // Oppdater avatar
    if (updateAvatarButton) {
        updateAvatarButton.addEventListener("click", () => {
            const avatarUrl = document.getElementById("avatarUrlInput").value;
            updateAvatar(avatarUrl);
        });
    }

    // Andre funksjoner som skal kjøre når DOM-en er lastet
    setAuthListeners(); // Legg til event listeners for autentisering
    updateCreditDisplay();
    updateBioDisplay();
});

// listings.js - Hente og vise alle auksjoner
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

            auctionList.innerHTML = '';  // Fjern eksisterende innhold

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

                auctionList.appendChild(auctionCard);  // Legg til auksjonskortet i containeren
            });
        } else {
            console.error('Listings is not an array:', listings);
        }
    } catch (error) {
        console.error('Error fetching the listings', error);
    }
}


// listing-details.js - Vise detaljene for en auksjon
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
                imageElement.src = (listing.media && listing.media.length > 0) 
                    ? listing.media[0].url 
                    : '/images/placeholder.jpg';
                imageElement.alt = (listing.media && listing.media.length > 0) 
                    ? listing.media[0].alt || listing.title 
                    : 'No image available';
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
                bidsInfoElement.textContent = listing.bids && listing.bids.length > 0
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
