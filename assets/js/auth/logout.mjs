import { save } from "../storage/storage.mjs";

export function logout() {
    console.log("Logout button clicked");  // Legg til en logg for debugging
    localStorage.removeItem("Token");
    localStorage.removeItem("Profile");

    console.log("Token and profile removed from localStorage");
    
    // Sjekk om localStorage er ryddet
    console.log(localStorage.getItem("Token"));  // Dette skal returnere null
    console.log(localStorage.getItem("Profile"));  // Dette skal returnere null
    
    // Omdiriger til forsiden
    window.location.href = "/index.html";
}
