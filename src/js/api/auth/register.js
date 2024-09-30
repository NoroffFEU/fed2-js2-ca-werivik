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


/**
Class representing a user.
Provides methods for validating and registering a user.
 */
class User {

    /**
  reates a user.
  @param {string} name - The name of the user.
  @param {string} email - The email of the user.
  @param {string} password - The password for the user's account.
  @param {string} [bio] - An optional bio for the user.
  @param {string} [banner] - An optional banner image URL.
  @param {string} [avatar] - An optional avatar image URL.
   */

  constructor(name, email, password, bio = "", banner = "", avatar = "") {
    this.name = name;
    this.email = email;
    this.password = password;
    this.bio = bio;
    this.banner = banner;
    this.avatar = avatar;
  }


   /**
  Validates the email format and ensures it's norwegian cause it must end with ".no".
  @static
  @param {string} email - The email to validate.
  @returns {boolean} - Returns true if the email is valid, otherwise DEATH, just kidding, it will be false.
   */


  static validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return emailPattern.test(email) && email.endsWith('.no');
  }


   /**
  Validates the password format.
  The password must be at least 8 characters long and contain at least one letter and one number. 
  @static
  @param {string} password - The password to validate.
  @returns {boolean} - Returns true if the password is valid, otherwise false as you already know.
   */

  static validatePassword(password) {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    
    return passwordPattern.test(password);
  }

  async register() {



   /**
  Registers the user with the provided details by sending them to the API.
  Performs validation on the email and password before making the request.
  @async
  @returns {Promise<Object|undefined>} - The API response data if registration is successful, otherwise undefined.
  @throws {Error} - Throws an error if registration fails.
   */

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


/**
Initializes the registration form and handles form submission.
Creates a new User and registers the user using the form data. 
very smart, very mindful...
@event
 */

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  
  if (registerForm) {

    /**
    Handles the form submission for user registration.
    Prevents default form submission and registers a new user.
    @param {Event} event - The form submission event.
     */
    
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
