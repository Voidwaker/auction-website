import { save, load } from "../storage/storage.mjs";
import { API_BASE, API_AUTH, API_REGISTER, API_LOGIN, API_CREATE_API_KEY } from "../constants.mjs"; 

export async function register(name, email, password) {
    const response = await fetch(`${API_BASE}${API_AUTH}${API_REGISTER}`, {
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
        return jsonResponse;
    } else {
        const errorText = await response.text();
        console.error("Registration failed:", errorText);
        throw new Error("Failed to register account");
    }
}

export async function login(email, password) {
    const response = await fetch(`${API_BASE}${API_AUTH}${API_LOGIN}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const responseData = await response.json();
        const { accessToken, name, email, avatar, banner, venueManager } = responseData.data;

        save("Token", accessToken);

        const profile = {
            name,
            email,
            avatar: avatar || { url: 'https://default-avatar-url.com/avatar.jpg', alt: 'Default Avatar' },
            banner: banner || { url: '/images/stacked-boxes.jpg', alt: 'Default Banner' },
            venueManager: venueManager || false,
        };
        save("Profile", profile);

        if (!load("ApiKey")) {
            await getApiKey();
        }

        console.log("User profile saved:", profile);
        return profile;
    } else {
        const errorText = await response.text();
        console.error("Login failed:", errorText);
        throw new Error("Failed to login");
    }
}

export async function getApiKey() {
    const response = await fetch(`${API_BASE}${API_AUTH}${API_CREATE_API_KEY}`, { 
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










