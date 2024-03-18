"use strict";
import CreateHeaders from "../util/headerManager.js"
import request from "../util/request.js"

const controller = new AbortController();
const signal = controller.signal;

const sourcePages = document.querySelectorAll("[data-source]");

export function setLoginScreen() {
  for (let sourcePage of sourcePages) {
    if (sourcePage.dataset.source === "login") {
      if (sourcePage.dataset.isSwitch === "true") {
        sourcePage.dataset.isSwitch = "false";
      }
      else {
        sourcePage.dataset.isSwitch = "true";
      }
      break;
    }
  }
}

export async function register({ username, password }) {
  try {
    const response = await request("/login/register", {
      method: "POST",
      headers: CreateHeaders.getHeaders(),
      body: JSON.stringify({
        username: username,
        password2: password,
        password1: password,
        email: `${(Math.random()).toString(16).substring(2)}@test.com`,
        fName: "user",
        lName: "test"
      }),
      signal: signal
    });
    
    const bearer_token = response.headers.get('Authorization');
    CreateHeaders.addAuth(bearer_token);
    
    return await response.json();
  } catch (error) {
    console.error(`Fetch login error: ${error.message}`);
    return null;
  }
}

export async function login({ username, password }) {
  try {
    const response = await request("/login", {
      method: "POST",
      headers: CreateHeaders.getHeaders(),
      body: JSON.stringify({
          username: username,
          password: password
      }),
      signal: signal
    });
    
    const bearer_token = response.headers.get('Authorization');
    CreateHeaders.addAuth(bearer_token);
    
    return await response.json();
  } catch (error) {
    console.error(`Fetch login error: ${error.message}`);
    return null;
  }
}

export async function logout() {
  try {
    const response = await request("/logout", {
      method: "GET",
      headers: CreateHeaders.getHeaders(),
      signal: signal
    });
    
    CreateHeaders.delete("Authorization");
    
    return await response.json();
  } catch (error) {
    console.error(`Fetch logout error: ${error.message}`);
    return null;
  }
}
