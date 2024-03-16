"use strict";
import FetchHeader from "./util/headerManager.js"
import { getDisctrict } from "./route/district.js"
import { login } from "./route/login.js"

FetchHeader.add('Accept', 'application/json');
FetchHeader.add('Content-Type', 'application/json');

const loginForm = document.querySelector("#login-form");
const district = document.querySelector("#district-api");
const api_result = document.querySelector("#api_result");

let isLogin = false;

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  const myFormData = new FormData(event.target);
  const form = Object.fromEntries(myFormData);
  const isLoggedIn = await login(form);
  
  if (!isLoggedIn) {
    api_result.textContent = "Failed to Login";
    isLogin = false;
    return;
  }
  
  isLogin = true;
  api_result.textContent = isLoggedIn.description;
});

district.addEventListener("click", (event) => {
  getDisctrict()
});