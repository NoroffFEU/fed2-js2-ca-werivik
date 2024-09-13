//export async function onRegister(event) {}

import { RegisterService } from "../../api/auth/register.js";

const registerService = new RegisterService();

export async function onRegister(event) {

  event.preventDefault();
  
  const form = event.target;
  const name = form.name.value;
  const email = form.email.value;
  const password = form.password.value;
  const bio = form.bio.value;
  const banner = form.banner.value;
  const avatar = form.avatar.value;

  try {
    const user = await registerService.register(name, email, password, bio, banner, avatar);
    window.location.href = '/auth/login/';
  } 
  
  catch (error) {
    alert(error.message);
  }
}
