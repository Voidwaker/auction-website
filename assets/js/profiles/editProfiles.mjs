export async function updateUserCredits(username, credits) {
    if (!username) {
        console.error("Username is undefined. Cannot update credits.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auction/profiles/${username}/credits`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${load("Token")}`,
                "X-Noroff-API-Key": API_KEY,
            },
            body: JSON.stringify({ credits }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update credits: ${response.status}`);
        }

        const result = await response.json();
        console.log("Credits updated:", result);
    } catch (error) {
        console.error("Error updating credits:", error);
    }
}





