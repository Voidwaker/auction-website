window.addEventListener("hashchange", handleRoute);
window.addEventListener("load", handleRoute);

function handleRoute() {
    const hashPath = window.location.hash || "#/";
    const route = hashPath.slice(1); // Fjerner hash-tegnet (#)

    if (route === "/auctions") {
        loadAuctionsPage();
    } else if (route === "/profile") {
        loadProfilePage();
    } else {
        loadHomePage(); // Standardrute
    }
}
