import { save, load } from "../storage/storage.mjs";
import { API_BASE, API_REGISTER, API_CREATE_API_KEY } from "../constants.mjs";
import { login } from "../auth/login.mjs"; 

export async function register(name, email, password) {
    const response = await fetch(`${API_BASE}${API_REGISTER}`, {  
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
        const jsonResponse = await response.json();
        console.log("Registration successful:", jsonResponse);

        await login(email, password); 

        if (!load("ApiKey")) {
            await getApiKey();
        }

        return jsonResponse;
    } else {
        const errorText = await response.text();
        console.error("Registration failed:", errorText);
        throw new Error("Failed to register account");
    }
}

export async function getApiKey() {
    const response = await fetch(`${API_BASE}${API_CREATE_API_KEY}`, {  
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${load("Token")}`,
        },
        method: "POST",
        body: JSON.stringify({ name: "Auction Website Key" }),
    });

    if (response.ok) {
        const apiKeyData = await response.json();
        save("ApiKey", apiKeyData.data.key);
        console.log("API key fetched:", apiKeyData);
        return apiKeyData;
    } else {
        const errorText = await response.text();
        console.error("Failed to fetch API key:", errorText);
        throw new Error("Failed to fetch API key");
    }
}











