const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;

export async function getApplicationStatus() {
    const response = await fetch(`${API_BASE_URL}/api/application/state`);
    if (!response.ok) {
        throw new Error("Failed to fetch application status");
    }
    return response.json();
}

export async function toggleApplicationStatus(enabled) {
    const response = await fetch(`${API_BASE_URL}/api/application/toggle`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ enabled }),
    });

    if (!response.ok) {
        throw new Error("Failed to toggle application status");
    }

    return response.json();
}
