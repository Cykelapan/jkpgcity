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

  console.log(form);
  let isLoggedIn

  if (form.isRegister) {
    isLoggedIn = await register({
      username: form.username,
      password: form.password
    });
  }
  else {
    isLoggedIn = await login({
      username: form.username,
      password: form.password
    });
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