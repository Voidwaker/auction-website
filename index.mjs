import { login } from "./assets/js/auth/login.mjs";
import { register } from "./assets/js/auth/register.mjs";
import { logout } from "./assets/js/auth/logout.mjs";
import { updateCreditDisplay, updateBioDisplay, updateProfileName, createAuction } from "./assets/js/profiles/viewProfile.mjs";
import { fetchAndDisplayListings } from "./assets/js/auctions/viewAuctions.mjs";
import { fetchAuctionDetails, placeBid } from "./assets/js/auctions/listing-details.mjs"; // Justert filsti for riktig path

// Event listener for login form
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        await login(email, password);
    });
}

// Event listener for register form
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

// Event listener for logout button
const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
    logoutButton.addEventListener("click", logout);
}

// Oppdater visning av kreditt og bio når profilen lastes inn
if (window.location.pathname.includes("/profile.html")) {
    updateCreditDisplay();
    updateBioDisplay();
    updateProfileName();

    const createAuctionForm = document.getElementById("createAuctionForm");
    if (createAuctionForm) {
        createAuctionForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const title = document.getElementById("auctionTitle").value;
            const description = document.getElementById("auctionDescription").value;
            const endDate = document.getElementById("auctionEndDate").value;
            const mediaUrl = document.getElementById("auctionMedia").value;
            await createAuction(title, description, endDate, mediaUrl);
        });
    }
}

// Hent og vis alle auksjoner på auctions.html
if (window.location.pathname.includes("/auctions.html")) {
    fetchAndDisplayListings();
}

// Hent auksjonsdetaljer og håndter bud på listing-details.html
if (window.location.pathname.includes("/listing-details.html")) {
    const params = new URLSearchParams(window.location.search);
    const auctionId = params.get('id');
    if (auctionId) {
        fetchAuctionDetails(auctionId);

        const placeBidForm = document.getElementById("placeBidForm");
        placeBidForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const bidAmount = document.getElementById("bidAmount").value;
            await placeBid(auctionId, bidAmount);
        });
    }
}

