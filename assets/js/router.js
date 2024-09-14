const routes = {
    '/': () => { loadHomePage(); },
    '/profile': () => { loadProfilePage(); },
    '/auctions': () => { loadAuctionsPage(); },
    '/listing-details': () => { loadListingDetailsPage(); }
  };
  
  function handleRouteChange() {
    const path = window.location.pathname;
    const route = routes[path];
    if (route) {
      route(); 
    } else {
      loadHomePage(); 
    }
  }
  
  window.addEventListener('popstate', handleRouteChange);
  
  function navigateTo(path) {
    window.history.pushState({}, path, window.location.origin + path);
    handleRouteChange();
  }
  
  function loadHomePage() {
    console.log("Loading home page...");
  }
  
  function loadProfilePage() {
    console.log("Loading profile page...");
  }
  
  function loadAuctionsPage() {
    console.log("Loading auctions page...");
  }
  
  function loadListingDetailsPage() {
    console.log("Loading listing details page...");
  }

  handleRouteChange();
  