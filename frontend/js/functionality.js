const targetButtons = document.querySelectorAll("[data-target]");
const sourcePages = document.querySelectorAll("[data-source]");
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
    const isSwitchedScreen = switchActiveScreen(eventData)
    
    if (!isSwitchedScreen && sourcePages.length !== 0) {
      sourcePages[0].classList.toggle("active", true);
    }
  });
}

function switchActiveScreen(targetScreen = "") {
  let isSwitchSuccess = false;
  
  for (sourcePage of sourcePages) {
    if (isSwitchSuccess) {
      sourcePage.classList.remove("active");
      continue;
    }
    if (sourcePage.dataset.source === targetScreen) {
      isSwitchSuccess = true;
      sourcePage.classList.add("active");
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