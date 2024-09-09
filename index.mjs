import { login } from "./assets/js/auth/login.mjs";//.//auth/login.mjs
import { register } from "./assets/js/auth/register.mjs"; //./auth/register.mjs
import { logout } from "./assets/js/auth/logout.mjs"; //./auth/logout.mjs
import { updateCreditDisplay, updateBioDisplay } from "./assets/js/profiles/viewProfile.mjs"; //./profiles/viewProfile.mjs
import { fetchAndDisplayListings } from "./assets/js/auctions/viewAuctions.mjs";//./auctions/viewAuctions.mjs

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
}

// Fetch og vis alle auksjoner på auctions.html
if (window.location.pathname.includes("/auctions.html")) {
    fetchAndDisplayListings();
}
