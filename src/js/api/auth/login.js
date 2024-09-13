//export async function login({ email, password }) {}

import { API_AUTH_LOGIN } from "../constant.js";
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

        if(response.ok) {
            return data;
        }

        else {
            throw new Error(data.message || "Login Failed");
        }
    }
}