"use strict";
import FetchHeader from "./util/headerManager.js"
import { 
  getDisctrict, 
  districtGenerateView 
} from "./route/district.js"
import { login } from "./route/login.js"
import { switchActiveScreen, trigger } from "./functionality.js"
import { userStoreGenerateView } from "./util/userStore.js"

FetchHeader.add('Accept', 'application/json');
FetchHeader.add('Content-Type', 'application/json');

const loginForm = document.querySelector("#login-form");
const logoutButton = document.querySelector("#logout");
const district = document.querySelector("#district-api");
const api_result = document.querySelector("#api_result");
const profile_name = document.querySelector("#profile-name");

const sourcePages = document.querySelectorAll("[data-source]");
const switchPages = document.querySelectorAll("[data-switch]");

let isLogin = false;

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  const myFormData = new FormData(event.target);
  const form = Object.fromEntries(myFormData);
  const isLoggedIn = await login(form);
  
  isLogin = isLoggedIn ? true : false;
  
  if (!isLogin) { return; }
  
  profile_name.textContent = isLoggedIn.username;
  
  setLoginScreen();
  switchActiveScreen("login");

  api_result.textContent = isLoggedIn 
    ? isLoggedIn.description 
    : "Failed to Login";
});

logoutButton.addEventListener("click", async (event) => {
  // Log out HERE!
  // await someFunctionToLogout()
  
  profile_name.textContent = "<LOG IN>";
  isLogin = false;
  setLoginScreen();
  switchActiveScreen("login");
});

function setLoginScreen() {
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

district.addEventListener("click", (event) => {
  districtGenerateView()
});

window.addEventListener("load", async (event) => {
  // setLoginScreen()
  switchActiveScreen("discover");
})