import { login } from "./assets/js/auth/login.mjs";
import { register } from "./assets/js/auth/register.mjs";
import { logout } from "./assets/js/auth/logout.mjs";
import { updateCreditDisplay, updateBioDisplay, updateProfileName } from "./assets/js/profiles/viewProfile.mjs";
import { fetchAndDisplayListings } from "./assets/js/auctions/viewAuctions.mjs";
import { fetchAuctionDetails, updateBidDisplay, placeBid } from "./assets/js/auctions/listing-details.mjs";

function handleLoginForm() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
            await login(email, password);
        });
    }
}

function handleRegisterForm() {
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
}

function handleLogoutButton() {
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }
}

function handleRouteChange() {
    const currentRoute = window.location.hash;

    if (currentRoute === "#/profile") {
        updateCreditDisplay();
        updateBioDisplay();
        updateProfileName();
    } else if (currentRoute === "#/auctions") {
        fetchAndDisplayListings();
    } else if (currentRoute.startsWith("#/listing-details")) {
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
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

    handleLoginForm();
    handleRegisterForm();
    handleLogoutButton();
}

window.addEventListener('hashchange', handleRouteChange);
window.addEventListener('load', handleRouteChange);

