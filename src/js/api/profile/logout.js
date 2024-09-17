import { headers } from "../headers.js";

function logout() {
    localStorage.removeItem('authToken');

    sessionStorage.removeItem('authToken');

    window.location.href = '/auth/login/index.html'
}

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});