import { login } from "./assets/js/auth/login.mjs";
import { register } from "./assets/js/auth/register.mjs";
import { logout } from "./assets/js/auth/logout.mjs";
import { updateCreditDisplay, updateBioDisplay, updateProfileName } from "./assets/js/profiles/viewProfile.mjs";
import { fetchAndDisplayListings } from "./assets/js/auctions/viewAuctions.mjs";
import { fetchAuctionDetails, updateBidDisplay, placeBid } from "./assets/js/auctions/listing-details.mjs";

/**
 * Handles the login form submission. On form submission, it retrieves
 * the email and password input values and calls the login function.
 * After successful login, the login modal is closed.
 * 
 * @function handleLoginForm
 */
function handleLoginForm() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
            await login(email, password);

            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (loginModal) {
                loginModal.hide(); 
            }
        });
    }
}

/**
 * Handles the register form submission. Retrieves all input values (name, email, password, bio, avatar URL)
 * and calls the register function. After successful registration, the register modal is closed.
 * 
 * @function handleRegisterForm
 */
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

            const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
            if (registerModal) {
                registerModal.hide(); 
            }
        });
    }
}

/**
 * Handles the logout button functionality. Calls the logout function
 * when the logout button is clicked.
 * 
 * @function handleLogoutButton
 */
function handleLogoutButton() {
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }
}

/**
 * Handles the routing changes based on the current window hash.
 * Depending on the route, it loads the correct content, such as profile updates, auction listings,
 * or individual auction details.
 * 
 * @function handleRouteChange
 */
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

