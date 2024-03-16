"use strict";
import FetchHeader from "./util/headerManager.js"
import { getDisctrict } from "./route/district.js"
import { login } from "./route/login.js"

FetchHeader.add('Accept', 'application/json');
FetchHeader.add('Content-Type', 'application/json');

const loginForm = document.querySelector("#login-form");
const logoutButton = document.querySelector("#logout");
const district = document.querySelector("#district-api");
const api_result = document.querySelector("#api_result");

const sourcePages = document.querySelectorAll("[data-source]");
const switchPages = document.querySelectorAll("[data-switch]");

let isLogin = false;

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  const myFormData = new FormData(event.target);
  const form = Object.fromEntries(myFormData);
  const isLoggedIn = await login(form);
  
  if (!isLoggedIn) {
    api_result.textContent = "Failed to Login";
    setLoginScreen();
    switchActiveScreen("login");
    isLogin = false;
    return;
  }
  
  isLogin = true;
  setLoginScreen();
  switchActiveScreen("login");
  api_result.textContent = isLoggedIn.description;
});

logoutButton.addEventListener("click", async (event) => {
  isLogin = false;
  setLoginScreen();
  switchActiveScreen("login");
});

function setLoginScreen() {
  for (let sourcePage of sourcePages) {
    if (sourcePage.dataset.source === "login") {
      if (sourcePage.dataset.isSwitch === "true") {
        sourcePage.dataset.isSwitch = "false";
        break;
      }
      else {
        sourcePage.dataset.isSwitch = "true";
        break;
      }
    }
  }
}

district.addEventListener("click", (event) => {
  getDisctrict()
});