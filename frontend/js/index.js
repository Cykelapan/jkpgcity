"use strict";
import CreateHeaders from "./headerManager.js"

// AbortController - is for cancelling fetch request
const controller = new AbortController();
const signal = controller.signal;

const district = document.querySelector("#district-api");
const api_result = document.querySelector("#api_result")

district.addEventListener("click", () => {
  login()
});

const headers = new CreateHeaders()

async function login() {
  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: headers.getHeaders(),
      body: JSON.stringify({
        username: "james_webs",
        password: "hello123123"
      }),
      signal: signal
    });
    
    const bearer_token = response.headers.get('Authorization');
    headers.addAuth(bearer_token)
    
    const data = await response.json()
    
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