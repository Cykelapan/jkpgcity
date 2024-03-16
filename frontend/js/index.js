"use strict";
import FetchHeader from "./util/headerManager.js"
import { getDisctrict } from "./route/district.js"
import { login } from "./route/login.js"

FetchHeader.add('Accept', 'application/json');
FetchHeader.add('Content-Type', 'application/json');

const loginButton = document.querySelector("#login");
const district = document.querySelector("#district-api");
const api_result = document.querySelector("#api_result")

loginButton.addEventListener("click", () => {
  login()
});

district.addEventListener("click", () => {
  getDisctrict()
});