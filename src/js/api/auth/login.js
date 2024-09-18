//export async function login({ email, password }) {}

import { API_AUTH_LOGIN } from "../constants.js";
import { headers } from "../headers.js";

export class AuthService {

    constructor() {
        this.apiUrl = API_AUTH_LOGIN;
    }

    async login(email, password) {
        
        const response = await fetch(this.apiUrl, {
            method: "POST",
            headers: headers(),
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {

            localStorage.setItem("username", data.data.name);
            localStorage.setItem("accessToken", data.data.accessToken);
           
            window.location.href = '/profile/index.html';
           
            return data;
        } 
        
        else {
            throw new Error(data.message || "Login Failed");
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('loginForm');
    const authService = new AuthService();

    if (loginForm) {

        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                await authService.login(email, password);
            } 
            
            catch (error) {
                console.error('Login error:', error);
                alert(error.message);
            }
        });
    }
});
