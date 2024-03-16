const targetButtons = document.querySelectorAll("[data-target]");
const sourcePages = document.querySelectorAll("[data-source]");
const switchPages = document.querySelectorAll("[data-switch]");
let topNavBar = document.querySelector("#topNavBar");

// navigation
for (targetBtn of targetButtons) {
  targetBtn.addEventListener("click", (event) => {
    const eventData = event.target.dataset.target;
    
    // toggle button actove state
    for (btn of targetButtons) {
      btn.classList.remove("active");
    }
    event.target.classList.add("active");
    
    // switch active screen: 
    // incase error default to first screen
    switchActiveScreen(eventData);
  });
}

function switchActiveScreen(targetScreen = "") {
  let isSwitchSuccess = false;
  
  for (let switchPage of switchPages) {
    switchPage.classList.remove("active");
  }
  
  for (let sourcePage of sourcePages) {
    sourcePage.classList.remove("active");
  }
  
  for (sourcePage of sourcePages) {
    if (sourcePage.dataset.isSwitch === "true") {
      for (let switchPage of switchPages) {
        if (switchPage.dataset.switch === targetScreen) {
          switchPage.classList.add("active");
          break;
        }
      }
    }
    else {
      if (sourcePage.dataset.source === targetScreen) {
        isSwitchSuccess = true;
        sourcePage.classList.add("active");
      }
    }
  }
  
  return isSwitchSuccess;
}


window.addEventListener("resize", (event) => {
  updateNavbarHeight();
})

function toggleNavbar() {
  topNavBar.classList.toggle("responsive");
  updateNavbarHeight();
}

function updateNavbarHeight() {
  let computedStyle = getComputedStyle(topNavBar);
  let height = computedStyle.height;
  
  updateRootVariable("--var-nav-height", height);
}

function updateRootVariable(variable, value) {
  let rootContainer = document.querySelectorAll('.container');
  for (container of rootContainer) {
    container.style.setProperty(variable, value);
  }
}