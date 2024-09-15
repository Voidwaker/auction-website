import { save } from "../storage/storage.mjs";
import { API_BASE, API_LOGIN } from "../constants.mjs";

export async function login(email, password) {
    try {
        // Utfører en POST-forespørsel for å logge inn
        const response = await fetch(`${API_BASE}${API_LOGIN}`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        console.log("Login response:", response); // Logger responsen fra serveren

        if (response.ok) {
            // Henter token og profilinformasjon fra responsen
            const { accessToken, ...profile } = (await response.json()).data;

            // Lagrer token og profilinformasjon i localStorage
            save("Token", accessToken);
            save("Profile", profile);

            // Lukker login-modalvinduet hvis det finnes
            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (modal) {
                modal.hide();
            }

            console.log("Redirecting to profile...");

            // Endrer hash for å omdirigere til profilsiden
            window.location.hash = "#/profile"; 
            
            // Logg for å bekrefte at hash-endringen skjer
            console.log("Hash set to: ", window.location.hash);

            return profile;
        } else {
            // Håndterer feilmelding hvis innlogging feiler
            const errorData = await response.json();
            console.error("Error response from server:", errorData);
        }
    } catch (error) {
        console.error("Failed to login:", error);  // Logger feil hvis noe går galt i prosessen
    }

    throw new Error("Failed to login");
}






