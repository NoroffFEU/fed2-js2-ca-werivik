// Use Postman, or JavaScript to get your API key
// In Workflow we will learn how to secure this information

import { headers } from "../api/headers.js";

const NOROFF_API_URL = "https://v2.api.noroff.dev";

export async function readPosts(accessToken) {
  const options = {
    method: 'GET',
    headers: headers(accessToken)
  };

  try {
    const response = await fetch(`${NOROFF_API_URL}`, options);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } 
  
  catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

export const API_KEY = "f7d9660d-4dba-4b16-82c6-1a4669e99612";

export const API_BASE = "https://v2.api.noroff.dev";

export const API_AUTH = `${API_BASE}/auth`;

export const API_AUTH_LOGIN = `${API_AUTH}/login`;

export const API_AUTH_REGISTER = `${API_AUTH}/register`;

export const API_AUTH_KEY = `${API_AUTH}/create-api-key`;

export const API_SOCIAL = `${API_BASE}/social`;

export const API_SOCIAL_POSTS = `${API_SOCIAL}/posts`;

export const API_SOCIAL_PROFILES = `${API_SOCIAL}/profiles`;
