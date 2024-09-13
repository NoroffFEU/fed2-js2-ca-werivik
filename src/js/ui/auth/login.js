//export async function onLogin(event) {}

import { AuthService } from "../../api/auth/login.js";

const authService = new AuthService();

export async function onLogin(event) {
    
  event.preventDefault();
  const form = event.target;
  const email = form.email.value;
  const password = form.password.value;

  try {
    const user = await authService.login(email, password);
    localStorage.setItem('token', user.token);
    window.location.href = '/';
  } 
  
  catch (error) {
    alert(error.message);
  }
}