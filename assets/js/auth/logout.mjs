import { save } from "../storage/storage.mjs";

export function logout() {
    console.log("Logout button clicked");  
    localStorage.removeItem("Token");
    localStorage.removeItem("Profile");

    console.log("Token and profile removed from localStorage");
    console.log(localStorage.getItem("Token"));  
    console.log(localStorage.getItem("Profile"));  

    window.location.hash = "#/";
}
