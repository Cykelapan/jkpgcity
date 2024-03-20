"use strict";
import FetchHeader from "./util/headerManager.js"
import {
  getDisctrict,
  districtGenerateView
} from "./route/district.js"
import { setLoginScreen, login, logout, register } from "./route/login.js"
import { switchActiveScreen, trigger } from "./functionality.js"
import { userStoreGenerateView } from "./util/userStore.js"



FetchHeader.add('Accept', 'application/json');
FetchHeader.add('Content-Type', 'application/json');

const loginForm = document.querySelector("#login-form");
const logoutButton = document.querySelector("#logout");
const profile_name = document.querySelector("#profile-name");
const nav_user = document.querySelector("[data-target=login]");

let isLogin = false;

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const myFormData = new FormData(event.target);
  const form = Object.fromEntries(myFormData);

  if (validateLoginForm(form) === false) {
    return console.error("Invalide input");
  }

  if (form.isRegister) {
    let isRegister = await register({
      username: form.username,
      password: form.password
    });
    
    if (isRegister.ok !== 200) {
      return console.warn("Register Failed", isRegister);
    }
  }
  
  let isLoggedIn = await login({
    username: form.username,
    password: form.password
  });
  
  console.log("isLoggedIn", isLoggedIn);
  
  if (isLoggedIn.error) {
    return console.error("Encountered error on login");
  }

  window.loginUser = isLoggedIn;

  isLogin = isLoggedIn ? true : false;

  if (!isLogin) { return; }

  profile_name.textContent = isLoggedIn.username;

  setLoginScreen();
  switchActiveScreen("login");
  nav_user.textContent = "User";
});

logoutButton.addEventListener("click", async (event) => {
  // Log out HERE!
  await logout();

  nav_user.textContent = "Login";
  profile_name.textContent = "<LOG IN>";
  isLogin = false;
  window.loginUser = null;
  setLoginScreen();
  switchActiveScreen("login");
});

window.addEventListener("load", async (event) => {
  // setLoginScreen()
  switchActiveScreen("discover");
})

function validateLoginForm(form) {
  if (!form.username.length || !form.password.length) {
    return false;
  }
  return true;
}