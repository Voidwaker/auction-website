import { fetchAndDisplayListings, setupSearchHandler } from './auctions/viewAuctions.mjs';
import { updateProfileName, updateBioDisplay, updateCreditDisplay, updateAvatar } from './profiles/viewProfile.mjs';
import { logout } from './auth/logout.mjs';
import { createAuction } from './auctions/createAuctions.mjs';
import { fetchAuctionDetails, updateBidDisplay } from './auctions/listing-details.mjs';

/**
 * Loads the homepage content, including the login, register buttons, and auction search section.
 * 
 * @function loadHomePage
 */
function loadHomePage() {
    document.getElementById('app').innerHTML = `
        <div class="container mt-5">
            <h1>welcome to my auction!</h1>
            <p>Sign up today, and get 1000 credit risk free! just click the register button below to sign up! Or you can login if you already have a user.
            Remember, only registered accounts can join an auction, so don't hesitate!</p>
            <div class="d-grid gap-2 d-md-flex justify-content-md-start">
                <button class="btn btn-primary me-md-2" data-bs-toggle="modal" data-bs-target="#loginModal">Log In</button>
                <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#registerModal">Register</button>
            </div>
            <div class="search-section mt-4">
                <input type="text" id="searchInput" class="form-control" placeholder="Search for auction...">
            </div>
            <div class="row mt-4" id="auction-list"></div>
        </div>
    `;

    setupSearchHandler();  
    fetchAndDisplayListings(); 
}

/**
 * Loads the profile page for the current logged-in user, including updating profile information and the ability to create auctions.
 * 
 * @function loadProfilePage
 */
function loadProfilePage() {
    document.getElementById('app').innerHTML = `
        <div class="container mt-5">
            <div class="row">
                <div class="col-md-4">
                    <div class="profile-sidebar">
                        <div class="profile-avatar">
                            <img id="avatarImage" src="/assets/images/standard-avatar.webp" alt="Avatar" class="img-thumbnail" width="150">
                            <p id="profileName" class="mt-2">Username</p>
                        </div>
                        <div class="profile-info">
                            <p><strong>Bio:</strong> <span id="profileBio">No bio available</span></p>
                            <p id="profileCredits">Credits: 0</p>
                        </div>
                        <div class="profile-actions">
                            <input type="text" id="avatarUrlInput" class="form-control mb-3" placeholder="Enter new avatar URL">
                            <button class="btn btn-primary w-100 mb-3" id="updateAvatarButton">Change Avatar</button>
                            <button class="btn logout-btn w-100" id="logoutButton">Logout</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <h2>Welcome to your profile</h2>
                    <div class="create-auction mt-5">
                        <h3>Create Auction</h3>
                        <form id="createAuctionForm">
                            <div class="mb-3">
                                <label for="auctionTitle" class="form-label">Auction Title</label>
                                <input type="text" class="form-control" id="auctionTitle" placeholder="Enter auction title" required>
                            </div>
                            <div class="mb-3">
                                <label for="auctionDescription" class="form-label">Description</label>
                                <textarea class="form-control" id="auctionDescription" rows="3" placeholder="Enter auction description" required></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="auctionEndDate" class="form-label">End Date</label>
                                <input type="datetime-local" class="form-control" id="auctionEndDate" required>
                            </div>
                            <div class="mb-3">
                                <label for="auctionMedia" class="form-label">Media URL (optional)</label>
                                <input type="url" class="form-control" id="auctionMedia" placeholder="Enter media URL">
                            </div>
                            <button type="submit" class="btn btn-primary">Create Auction</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    updateProfileName();
    updateBioDisplay();
    updateCreditDisplay();

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            await logout();
            window.location.hash = '#/';
        });
    }

    const avatarButton = document.getElementById('updateAvatarButton');
    if (avatarButton) {
        avatarButton.addEventListener('click', () => {
            const newAvatarUrl = document.getElementById('avatarUrlInput').value;
            updateAvatar(newAvatarUrl);
        });
    }

    const createAuctionForm = document.getElementById('createAuctionForm');
    if (createAuctionForm) {
        createAuctionForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const title = document.getElementById('auctionTitle').value;
            const description = document.getElementById('auctionDescription').value;
            const endDate = document.getElementById('auctionEndDate').value;
            const mediaUrl = document.getElementById('auctionMedia').value;
            await createAuction(title, description, endDate, mediaUrl);
        });
    }
}

/**
 * Loads the auctions page where all auctions are listed and searchable.
 * 
 * @function loadAuctionsPage
 */
function loadAuctionsPage() {
    document.getElementById('app').innerHTML = `
        <div class="container mt-5">
            <h1 class="text-center mb-4">All Auctions</h1>
            <div class="search-section mb-4">
                <input type="text" id="searchInput" class="form-control" placeholder="Search for auctions...">
            </div>
            <div class="row" id="auction-list">
                <!-- Auctions will be displayed here -->
            </div>
        </div>
    `;

    setupSearchHandler(); 
    fetchAndDisplayListings();  
}

/**
 * Loads auction details page for a specific auction.
 * 
 * @function loadAuctionDetailsPage
 * @param {string} listingId - The ID of the auction listing to display.
 */
function loadAuctionDetailsPage(listingId) {
    if (listingId) {
        fetchAuctionDetails(listingId);
        updateBidDisplay(listingId);  
    } else {
        console.error('No listing ID provided for auction details.');
    }
}

/**
 * Handles the routing of the application based on the current URL hash.
 * 
 * @function router
 */
function router() {
    const path = location.hash.slice(1) || '/';
    const route = {
        '/': loadHomePage,
        '/profile': loadProfilePage,
        '/auctions': loadAuctionsPage,
    };

    if (path.startsWith('listing/')) {
        const listingId = path.split('/')[1];
        loadAuctionDetailsPage(listingId);
    } else if (route[path]) {
        route[path]();
    } else {
        console.error('Route not found');
    }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
