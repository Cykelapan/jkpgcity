"use strict";
import CreateHeaders from "../util/headerManager.js"
import request from "../util/request.js"

const controller = new AbortController();
const signal = controller.signal;

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
    console.error(`Fetch error: ${error.message}`);
    return null;
  }
}