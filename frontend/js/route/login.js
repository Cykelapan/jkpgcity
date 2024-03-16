"use strict";
import CreateHeaders from "../util/headerManager.js"
import request from "../util/request.js"

const controller = new AbortController();
const signal = controller.signal;

const api_result = document.querySelector("#api_result");

export async function login({ username, password }) {
  console.log(username, password);
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
    CreateHeaders.addAuth(bearer_token)
    
    const data = await response.json();
    api_result.textContent = data.description;
  } catch (error) {
    console.error(`Fetch error: ${error.message}`);
    api_result.textContent = error.message
  }
}

async function fetchLogin() {
  try {
    const response = await fetch("/login", { signal: signal });
    const data = await response.text()
    console.log("Fetch complete", data);
    api_result.textContent = data
  } catch (error) {
    console.error(`Fetch error: ${error.message}`);
    api_result.textContent = error.message
  }
}