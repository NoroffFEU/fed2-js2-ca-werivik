/*
export async function register({
  name,
  email,
  password,
  bio,
  banner,
  avatar,
}) {}
*/

import { API_AUTH_REGISTER } from "../constants.js";
import { headers } from "../headers.js";

class User {

  constructor(name, email, password, bio = "", banner = "", avatar = "") {
    this.name = name;
    this.email = email;
    this.password = password;
    this.bio = bio;
    this.banner = banner;
    this.avatar = avatar;
  }

  static validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return emailPattern.test(email) && email.endsWith('.no');
  }

  static validatePassword(password) {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    
    return passwordPattern.test(password);
  }

  async register() {

    if (!User.validateEmail(this.email)) {
      alert('Invalid email address. Must end with .no');
     
      return;
    }
  
    if (!User.validatePassword(this.password)) {
      alert('Invalid password. Must be at least 8 characters long and include both letters and numbers');
     
      return;
    }
  
    try {

      const payload = {
        name: this.name,
        email: this.email,
        password: this.password,
        bio: this.bio || undefined,
        banner: this.banner || undefined,
        avatar: this.avatar || undefined
      };
  
      console.log('Sending request with payload:', payload);
  
      const response = await fetch(API_AUTH_REGISTER, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {

        const errorResponse = await response.json();
        console.error('Error response:', errorResponse);
  
        if (errorResponse.errors && errorResponse.errors.some(error => error.message === 'Profile already exists')) {
          alert('Username or email is already in use. Please choose another.');
        } 
        
        else {
          alert(`Registration failed: ${errorResponse.message || 'Unknown error'}`);
        }
       
        return;
      }
  
      const result = await response.json();

      alert('Registration successful! Redirecting to login page.');
      window.location.href = '/auth/login/index.html';
      
      return result;
    } 
    
    catch (error) {
      console.error('Error during registration:', error);
      alert('An unexpected error occurred during registration');
    }

  }
}

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  
  if (registerForm) {
    
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const bioInput = document.getElementById('bio');

      if (!nameInput || !emailInput || !passwordInput) {
        console.error('One or more required form fields are missing.');
        alert('Please make sure all required fields are filled out.');
       
        return;
      }

      const name = nameInput.value;
      const email = emailInput.value;
      const password = passwordInput.value;
      const bio = bioInput ? bioInput.value : "";

      const user = new User(name, email, password, bio);
      await user.register();
    });
  }
});
