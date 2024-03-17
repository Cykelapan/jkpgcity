"use strict";
import { getDisctrict, districtGenerateView } from "./route/district.js"

const targetButtons = document.querySelectorAll("[data-target]");
const sourcePages = document.querySelectorAll("[data-source]");
const switchPages = document.querySelectorAll("[data-switch]");
let topNavBar = document.querySelector("#topNavBar");

let currentScreen = "";
let isSwitchScreen = false;

// navigation
for (let targetBtn of targetButtons) {
  targetBtn.addEventListener("click", (event) => {
    // toggle button actove state
    for (let btn of targetButtons) {
      btn.classList.remove("active");
    }
    event.target.classList.add("active");
    
    // switch active screen: 
    // incase error default to first screen
    switchActiveScreen(event.target.dataset.target);
  });
}

export async function trigger() {
  if (currentScreen === "login") {
    return
  }
  if (currentScreen === "discover" && isSwitchScreen) {
    return console.log("get Detail");
  }
  if (currentScreen === "discover") {
    await getDisctrict();
    districtGenerateView();
    return;
  }
}

export function switchActiveScreen(targetScreen = "") {
  let isSwitchSuccess = false;
  
  for (let switchPage of switchPages) {
    switchPage.classList.remove("active");
  }
  
  for (let sourcePage of sourcePages) {
    sourcePage.classList.remove("active");
  }
  
  for (let sourcePage of sourcePages) {
    if (sourcePage.dataset.isSwitch === "true") {
      for (let switchPage of switchPages) {
        // incase switch screen again to target
        if (switchPage.dataset.switch === targetScreen) {
          isSwitchSuccess = true;
          isSwitchScreen = true;
          switchPage.classList.add("active");
          currentScreen = targetScreen
          break;
        }
      }
    }
    else {
      // normal active screen
      if (sourcePage.dataset.source === targetScreen) {
        isSwitchSuccess = true;
        isSwitchScreen = false
        sourcePage.classList.add("active");
        currentScreen = targetScreen
      }
    }
  }
  
  trigger();
  
  return isSwitchSuccess;
}