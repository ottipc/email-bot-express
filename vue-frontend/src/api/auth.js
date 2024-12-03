const API_BASE_URL = process.env.APP_API_BASE_URL + '/api/auth';

/**
 * Führt einen Login aus und erhält einen JWT-Token.
 * @param {string} username - Der Benutzername.
 * @param {string} password - Das Passwort.
 * @returns {Promise<object>} - Die Antwort des Servers ({ token: "JWT_TOKEN" }).
 */
export async function login(username, password) {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
    }

    return response.json(); // Antwortdaten parsen
}

/**
 * Führt einen HTTP-Aufruf mit optionalem JWT-Token durch.
 * @param {string} endpoint - Der Endpunkt der API (z. B. '/api/auth/login').
 * @param {string} method - Die HTTP-Methode (GET, POST, etc.).
 * @param {object} [body] - Der Anfragetext im JSON-Format (optional).
 * @returns {Promise<object>} - Die Antwort im JSON-Format.
 */
async function fetchWithToken(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('token'); // JWT-Token aus localStorage
    const headers = {
        'Content-Type': 'application/json',
    };

    // Füge den Authorization-Header hinzu, falls ein Token vorhanden ist
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    // Anfrageoptionen
    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body); // JSON-Body einfügen, falls vorhanden
    }

    // HTTP-Aufruf
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
    }

    return response.json(); // JSON-Antwort parsen
}

export default fetchWithToken;