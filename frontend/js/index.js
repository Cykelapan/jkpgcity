"use strict";
import FetchHeader from "./util/headerManager.js"
import { getDisctrict } from "./route/district.js"
import { login } from "./route/login.js"

FetchHeader.add('Accept', 'application/json');
FetchHeader.add('Content-Type', 'application/json');

const loginForm = document.querySelector("#login-form");
const district = document.querySelector("#district-api");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  
  const myFormData = new FormData(event.target);
  const form = Object.fromEntries(myFormData);
  login(form);
});

district.addEventListener("click", (event) => {
  getDisctrict()
});