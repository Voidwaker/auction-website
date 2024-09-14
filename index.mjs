/* import { login } from "./assets/js/auth/login.mjs";
import { register } from "./assets/js/auth/register.mjs";
import { logout } from "./assets/js/auth/logout.mjs";
import { updateCreditDisplay, updateBioDisplay, updateProfileName } from "./assets/js/profiles/viewProfile.mjs";
import { fetchAndDisplayListings } from "./assets/js/auctions/viewAuctions.mjs";
import { fetchAuctionDetails, updateBidDisplay, placeBid } from "./assets/js/auctions/listing-details.mjs";

const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        await login(email, password);
    });
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const bio = document.getElementById("registerBio").value;
        const avatarUrl = document.getElementById("registerAvatarUrl").value;
        await register(name, email, password, bio, avatarUrl);
    });
}

const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
    logoutButton.addEventListener("click", logout);
}

if (window.location.pathname.includes("/profile.html")) {
    updateCreditDisplay();
    updateBioDisplay();
    updateProfileName();
}

if (window.location.pathname.includes("/auctions.html")) {
    fetchAndDisplayListings();
}

if (window.location.pathname.includes("/listing-details.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get('id');

    if (listingId) {
        fetchAuctionDetails(listingId);
        updateBidDisplay(listingId);

        const placeBidForm = document.getElementById("placeBidForm");
        if (placeBidForm) {
            placeBidForm.addEventListener("submit", async (event) => {
                event.preventDefault();
                const bidAmount = parseFloat(document.getElementById("bidAmount").value);
                await placeBid(listingId, bidAmount);
            });
        }
    }
}
 */

// Importer alle nødvendige moduler
import { login } from "./assets/js/auth/login.mjs";
import { register } from "./assets/js/auth/register.mjs";
import { logout } from "./assets/js/auth/logout.mjs";
import { updateCreditDisplay, updateBioDisplay, updateProfileName } from "./assets/js/profiles/viewProfile.mjs";
import { fetchAndDisplayListings } from "./assets/js/auctions/viewAuctions.mjs";
import { fetchAuctionDetails, updateBidDisplay, placeBid } from "./assets/js/auctions/listing-details.mjs";

// Funksjon for å håndtere ruter
function handleRoute() {
    const path = window.location.pathname;

    if (path === "/" || path === "/index.html") {
        // Logikk for hjemmesiden (index)
        console.log("Viser hjemmesiden");
    }

    if (path.includes("/profile.html")) {
        // Profile-siden
        updateCreditDisplay();
        updateBioDisplay();
        updateProfileName();
    }

    if (path.includes("/auctions.html")) {
        // Auctions-siden
        fetchAndDisplayListings();
    }

    if (path.includes("/listing-details.html")) {
        // Hent listing-id fra URL
        const urlParams = new URLSearchParams(window.location.search);
        const listingId = urlParams.get('id');

        if (listingId) {
            fetchAuctionDetails(listingId);
            updateBidDisplay(listingId);

            const placeBidForm = document.getElementById("placeBidForm");
            if (placeBidForm) {
                placeBidForm.addEventListener("submit", async (event) => {
                    event.preventDefault();
                    const bidAmount = parseFloat(document.getElementById("bidAmount").value);
                    await placeBid(listingId, bidAmount);
                });
            }
        }
    }
}

// Logikk for login-form
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        await login(email, password);
    });
}

// Logikk for register-form
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const bio = document.getElementById("registerBio").value;
        const avatarUrl = document.getElementById("registerAvatarUrl").value;
        await register(name, email, password, bio, avatarUrl);
    });
}

// Logikk for logout
const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
    logoutButton.addEventListener("click", logout);
}

// Kall handleRoute for å aktivere ruter
handleRoute();
