
/*
import { API_KEY } from "./constants";

export function headers() {
  const headers = new Headers();

  if (API_KEY) {
    headers.append("X-Noroff-API-Key", API_KEY);
  }

  return headers;
}
*/

import { API_KEY } from "../api/constants.js";

export function headers(accessToken = "") {
  
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("X-Noroff-API-Key", API_KEY);

  if (accessToken) {
    headers.append("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
}
