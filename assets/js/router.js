import { fetchAndDisplayListings, filterAuctions } from './auctions/viewAuctions.mjs';
import { updateProfileName, updateBioDisplay, updateCreditDisplay, updateAvatar } from './profiles/viewProfile.mjs';
import { logout } from './auth/logout.mjs';
import { createAuction } from './auctions/createAuctions.mjs';
import { fetchAuctionDetails } from './auctions/listing-details.mjs'; // Import for å håndtere listing-details

function loadHomePage() {
    document.getElementById('app').innerHTML = `
        <div class="container mt-5">
            <h1>Welcome to Auction Website</h1>
            <p>This is the homepage where users can explore the platform.</p>
        </div>
    `;
}

function loadRegistrationPage() {
    document.getElementById('app').innerHTML = `
        <section class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <h2 class="text-center">Register</h2>
                    <form id="registerForm" name="registerForm">
                        <div class="mb-3">
                            <label for="registerName" class="form-label">Name</label>
                            <input type="text" class="form-control" id="registerName" placeholder="Enter name" required pattern="^[a-zA-Z0-9_]+$" title="Name can only contain letters, numbers, and underscores">
                        </div>
                        <div class="mb-3">
                            <label for="registerEmail" class="form-label">Email address</label>
                            <input type="email" class="form-control" id="registerEmail" placeholder="Enter email" required>
                        </div>
                        <div class="mb-3">
                            <label for="registerPassword" class="form-label">Password</label>
                            <input type="password" class="form-control" id="registerPassword" placeholder="Password" required minlength="8">
                        </div>
                        <div class="mb-3">
                            <label for="registerBio" class="form-label">Bio</label>
                            <textarea class="form-control" id="registerBio" placeholder="Tell us about yourself (max 160 characters)" maxlength="160"></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="registerAvatarUrl" class="form-label">Avatar URL (optional)</label>
                            <input type="url" class="form-control" id="registerAvatarUrl" placeholder="Enter avatar URL">
                        </div>
                        <button type="submit" class="btn btn-secondary">Register</button>
                    </form>
                </div>
            </div>
        </section>
    `;
}

function loadAuctionsPage() {
    document.getElementById('app').innerHTML = `
        <div class="container mt-5">
            <h1 class="text-center mb-4">All Auctions</h1>
            <div class="row mb-4">
                <div class="col-md-8 offset-md-2">
                    <input type="text" id="searchInput" class="form-control" placeholder="Search auctions...">
                </div>
            </div>
            <div class="row" id="auction-list"></div>
        </div>
    `;
    fetchAndDisplayListings();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            filterAuctions(searchTerm);
        });
    }
}

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
                            <button class="btn btn-danger w-100" id="logoutButton">Logout</button>
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

    const avatarButton = document.getElementById('updateAvatarButton');
    if (avatarButton) {
        avatarButton.addEventListener('click', () => {
            const newAvatarUrl = document.getElementById('avatarUrlInput').value;
            updateAvatar(newAvatarUrl);
        });
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
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

function loadListingDetailsPage(id) {
    document.getElementById('app').innerHTML = `
        <div class="container mt-5">
            <h1>Auction Details</h1>
            <!-- Auction details will be fetched and displayed here -->
        </div>
    `;
    fetchAuctionDetails(id); 
}

const routes = {
    '/': loadHomePage,
    '/auctions': loadAuctionsPage,
    '/profile': loadProfilePage,
    '/registration': loadRegistrationPage,
    '/listing-details/:id': (id) => loadListingDetailsPage(id) 
};

function router() {
    const path = location.hash.slice(1) || '/';
    const [routeBase, routeParam] = path.split('/');
    const route = routes[`/${routeBase}`];

    if (routeBase === 'listing-details' && routeParam) {
        routes['/listing-details/:id'](routeParam); 
    } else if (route) {
        route();
    } else {
        document.getElementById('app').innerHTML = `
            <div class="container mt-5">
                <h1>404 - Page not found</h1>
                <p>The page you are looking for does not exist.</p>
            </div>
        `;
    }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
