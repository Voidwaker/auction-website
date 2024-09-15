import { fetchAndDisplayListings, filterAuctions } from './auctions/viewAuctions.mjs';
import { updateProfileName, updateBioDisplay, updateCreditDisplay } from './profiles/viewProfile.mjs';
import { logout } from './auth/logout.mjs';
import { createAuction } from './auctions/createAuctions.mjs';
import { fetchAuctionDetails } from './auctions/listing-details.mjs';

function loadHomePage() {
    console.log("Laster hjemmesiden...");
    document.getElementById('app').innerHTML = `
        <div class="container mt-5 text-center">
            <h1>Velkommen til Auksjonsnettstedet</h1>
            <p>Dette er hjemmesiden hvor brukere kan utforske plattformen.</p>
            <div class="mt-4">
                <!-- Knappene for innlogging og registrering -->
                <button class="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#loginModal">Logg inn</button>
                <button class="btn btn-secondary btn-lg ms-3" data-bs-toggle="modal" data-bs-target="#registerModal">Registrer deg</button>
            </div>
        </div>
    `;
}

function loadAuctionsPage() {
    console.log("Laster auksjonssiden...");
    document.getElementById('app').innerHTML = `
        <div class="container mt-5">
            <h1 class="text-center mb-4">Alle Auksjoner</h1>
            <div class="row mb-4">
                <div class="col-md-8 offset-md-2">
                    <input type="text" id="searchInput" class="form-control" placeholder="Søk i auksjoner...">
                </div>
            </div>
            <div class="row" id="auction-list">
                <!-- Auksjoner vil bli generert her -->
            </div>
        </div>
    `;

    setTimeout(() => {
        fetchAndDisplayListings();
    }, 100); 

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            filterAuctions(searchTerm);
        });
    }
}

function loadProfilePage() {
    console.log("Laster profilside...");
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
                </div>
            </div>
        </div>
    `;

    updateProfileName();
    updateBioDisplay();
    updateCreditDisplay();
}

function loadRegistrationPage() {
    console.log("Laster registreringsside...");
    document.getElementById('app').innerHTML = `
        <div class="container mt-5">
            <h2>Registrer deg</h2>
            <form id="registerForm">
                <div class="mb-3">
                    <label for="registerName" class="form-label">Navn</label>
                    <input type="text" class="form-control" id="registerName" placeholder="Skriv inn navnet ditt" required>
                </div>
                <div class="mb-3">
                    <label for="registerEmail" class="form-label">E-postadresse</label>
                    <input type="email" class="form-control" id="registerEmail" placeholder="Skriv inn e-posten din" required>
                </div>
                <div class="mb-3">
                    <label for="registerPassword" class="form-label">Passord</label>
                    <input type="password" class="form-control" id="registerPassword" placeholder="Skriv inn passordet ditt" required>
                </div>
                <button type="submit" class="btn btn-primary">Registrer deg</button>
            </form>
        </div>
    `;
}

function loadListingDetailsPage(id) {
    console.log("Laster auksjonsdetaljer...");
    document.getElementById('app').innerHTML = `
        <div class="container mt-5">
            <h1>Auksjonsdetaljer</h1>
            <!-- Auksjonsdetaljer vil bli hentet og vist her -->
        </div>
    `;
    fetchAuctionDetails(id);
}

const routes = {
    '/': loadHomePage,
    '/auctions': loadAuctionsPage,
    '/profile': loadProfilePage,
    '/registration': loadRegistrationPage,
};

function router() {
    const path = window.location.hash.slice(1) || '/';
    console.log("Navigating to:", path);

    if (routes[path]) {
        console.log("Laster rute:", path);
        routes[path](); 
    } else {
        console.log("Route not found:", path);
        document.getElementById('app').innerHTML = `
            <div class="container mt-5">
                <h1>404 - Siden finnes ikke</h1>
                <p>Siden du leter etter eksisterer ikke.</p>
            </div>
        `;
    }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
