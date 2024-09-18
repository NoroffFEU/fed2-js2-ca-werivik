import { headers } from "../headers.js";

function logout() {

    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');
    
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('accessToken');
    
    window.location.href = '/auth/login/index.html';
}

document.addEventListener('DOMContentLoaded', () => {

    const logoutButton = document.getElementById('logoutButton');
   
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});
