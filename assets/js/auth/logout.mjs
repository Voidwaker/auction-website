import { save } from "../storage/storage.mjs";

/**
 * Logs out the user by removing their token and profile data from local storage.
 * After removing the data, the user is redirected to the home page.
 * 
 * @function logout
 */
export function logout() {
    console.log("Logout button clicked");  

    localStorage.removeItem("Token");
    localStorage.removeItem("Profile");

    console.log("Token and profile removed from localStorage");

    console.log(localStorage.getItem("Token"));  
    console.log(localStorage.getItem("Profile"));  

    window.location.hash = "#/";
}
