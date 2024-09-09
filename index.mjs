import { login } from "./assets/js/auth/login.mjs";
import { register } from "./assets/js/auth/register.mjs";
import { logout } from "./assets/js/auth/logout.mjs";
import { updateCreditDisplay, updateBioDisplay, updateProfileName } from "./assets/js/profiles/viewProfile.mjs";
import { fetchAndDisplayListings } from "./assets/js/auctions/viewAuctions.mjs";
import { createAuction } from "./assets/js/auctions/createAuctions.mjs";

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


if (window.location.pathname.includes("/auctions.html")) {
    fetchAndDisplayListings();
}
