const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || "http://localhost:3000";

/**
 * Ruft den aktuellen Zustand der Anwendung ab.
 */
export async function getApplicationState() {
    const response = await fetch(`${API_BASE_URL}/api/application/state`);
    if (!response.ok) {
        const errorText = await response.text(); // Detaillierte Fehlerbeschreibung
        throw new Error(`Failed to fetch application status: ${errorText}`);
    }
    return response.json();
}

/**
 * Schaltet den Zustand der Anwendung um.
 */
export async function toggleApplicationState() {
    console.log("Sending POST request to:", `${API_BASE_URL}/api/application/toggle`);

    const response = await fetch(`${API_BASE_URL}/api/application/toggle`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        throw new Error(`Failed to toggle application status: ${errorText}`);
    }

    const jsonResponse = await response.json();
    console.log("Response JSON:", jsonResponse);

    return jsonResponse;
}