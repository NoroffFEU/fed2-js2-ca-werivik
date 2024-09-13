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

async function validateUsername(username) {
  
  try {
    const response = await fetch(`https://v2.api.noroff.dev/${username}`);
    
    return response.status === 404;
  } 
  
  catch (error) {
    console.error('Error:', error);
    
    return false;
  }
}

function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailPattern.test(email) && email.endsWith('.no');
}

function validatePassword(password) {
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  
  return passwordPattern.test(password);
}

async function registerUser(userData) {
  const { name, email, password, bio } = userData;

  if (!validateEmail(email)) {
    alert('Invalid email address. Must end with .no');
    
    return;
  }

  if (!validatePassword(password)) {
    alert('Invalid password. Must be at least 8 characters long and include both letters and numbers');
    
    return;
  }

  try {
    
    const response = await fetch(API_AUTH_REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, bio }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      alert(`Registration failed: ${errorResponse.message || 'Unknown error'}`);
      
      return;
    }

    const result = await response.json();
    alert('Registration successful! Redirecting to login page.');
    window.location.href = 'login.html';
    
    return result;
  } 
  
  catch (error) {
    console.error('Error:', error);
    alert('An unexpected error occurred during registration');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  
  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const bio = document.getElementById('bio').value;

      await registerUser({ name, email, password, bio });
    });
  }
});
