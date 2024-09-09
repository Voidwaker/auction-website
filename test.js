// Definer API-konstanter
export const API_KEY = "233a5a18-686a-429b-864d-e65aa63b89da";
export const API_BASE = "https://v2.api.noroff.dev";
export const API_AUTH = "/auth";
export const API_REGISTER = "/register";
export const API_LOGIN = "/login";
export const API_AUCTION = "/auction";
export const API_PROFILES = `${API_AUCTION}/profiles`;
export const API_CREDITS = "/credits";

// Lagre og hente fra localStorage
export function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function load(key) {
    return JSON.parse(localStorage.getItem(key));
}

// Hent brukerens credits
export async function fetchUserCredits() {
    const profile = load("Profile");
    if (!profile) throw new Error("No profile found");

    const response = await fetch(`${API_BASE}${API_PROFILES}/${profile.name}${API_CREDITS}`, {
        headers: { 
            Authorization: `Bearer ${load("Token")}`
        }
    });

    if (response.ok) {
        const { data } = await response.json();
        save("Credits", data); // Lagre credits i localStorage
        return data;
    } else {
        throw new Error("Failed to fetch credits");
    }
}

// Registrer en ny bruker med 1000 kreditter
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
        
        // Hent brukerens credits etter innlogging
        await fetchUserCredits();

        window.location.href = "/pages/profile.html";  // Omdiriger til profilsiden etter innlogging
        return profile;
    }

    throw new Error("Failed to login");
}

// Håndter innlogging og registrering
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
        await login(email, password);  // Logg inn brukeren etter registrering
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

// **Ny kortbasert visning - erstatter karusellen**
export async function fetchAndDisplayListings() {
    try {
        const response = await fetch(ALL_LISTINGS_URL);
        const result = await response.json();

        console.log(result);  // Logg responsen for å se strukturen

        const listings = result.data || result;
        if (Array.isArray(listings)) {
            const auctionList = document.getElementById('auction-list');
            if (!auctionList) {
                throw new Error('Element with id "auction-list" not found in the DOM');
            }

            auctionList.innerHTML = ''; // Tøm eksisterende innhold

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

// Log out-funksjon
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            // Fjern token og profilinformasjon fra localStorage
            localStorage.removeItem("Token");
            localStorage.removeItem("Profile");
            localStorage.removeItem("Credits");

            // Omdiriger brukeren til forsiden eller innloggingssiden
            window.location.href = "/index.html";
        });
    }

    // Andre funksjoner som skal kjøre når DOM-en er lastet
    setAuthListeners();
    fetchAndDisplayListings();
    getApiKey();  // Hent API-nøkkel for testing
});
