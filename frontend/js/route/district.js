"use strict";
import CreateHeaders from "../util/headerManager.js"
import request from "../util/request.js"

const discoverHeadline = document.querySelector(".discover-district-headline");
const discoverContainer = document.querySelector("[data-source=discover] > .discover-district");
const discoverFilterContainer = document.querySelector(".discover-district-filter");

const discover_template = document.querySelector("#discover-template");
const discover_detail_template = document.querySelector("#discover-detail-template");
const discover_filter_template = document.querySelector("#discover-filter-template");

const controller = new AbortController();
const signal = controller.signal;

let districtList = [];
let districtDetailList = [];
let districtFilters = {};

export function districtGenerateView() {
  while (discoverContainer.hasChildNodes()) {
    discoverContainer.removeChild(discoverContainer.firstChild);
  }
  
  for (let district of districtList) {
    const newElement = discover_template.content.cloneNode(true);
    const title = newElement.querySelector(".card-title");
    title.textContent = district;
    
    const districtElement = newElement.querySelector(".discover-district-title");
    
    districtElement.dataset.district = district;
    
    districtElement.addEventListener("click", async (event) => {
      let getDisctrictName = event.currentTarget.dataset.district;
      
      await getDisctrictDetail(getDisctrictName);
      await districtDetailGenerateView();
      
      discoverHeadline.textContent = `Discover ${getDisctrictName}`;
    });
    
    discoverContainer.appendChild(newElement);
    discoverHeadline.textContent = `Discover Jönköping`;
  }
}

export function removeFilterView() {
  while (discoverFilterContainer.hasChildNodes()) {
    discoverFilterContainer.removeChild(discoverFilterContainer.firstChild);
  }
}

export function addFilterView() {
  removeFilterView();
  
  const newElement = discover_filter_template.content.cloneNode(true);
  const filters = newElement.querySelectorAll("select");
  
  for (let filter of filters) {
    if (districtFilters[filter.name]) {
      filter.value = districtFilters[filter.name].name;
    }
    
    filter.addEventListener("change", async(event) => {
      districtFilters[filter.name] = {
        name: event.target.value,
        rearrange: (a, b) => {
          const first = a[filter.dataset.entry];
          const second = b[filter.dataset.entry];
          if (event.target.value === "asc") {
            return first.localeCompare(second, "sv", { sensitivity: "variant" });
          }
          return second.localeCompare(first, "sv", { sensitivity: "variant" });
        }
      }
      sortDistrictDetailList();
    });
  }
  
  discoverFilterContainer.appendChild(newElement);
}


function sortDistrictDetailList() {
  districtDetailList.sort((a, b) => {
    for (let filter in districtFilters) {
      if (typeof districtFilters[filter].rearrange !== "function") {
        continue;
      }
      
      const res = districtFilters[filter].rearrange(a, b) === 1 ? true : false;
      if (res) { return true; }
    }
    
    return false;
  });
  districtDetailGenerateView();
}

export function districtDetailGenerateView() {
  while (discoverContainer.hasChildNodes()) {
    discoverContainer.removeChild(discoverContainer.firstChild);
  }
  
  if (districtDetailList.length) {
    addFilterView();
  }
  
  for (let detailDistrict of districtDetailList) {
    const newElement = discover_detail_template.content.cloneNode(true);
    
    const storeElement = newElement.querySelector("strong");
    const descriptionElement = newElement.querySelector("small");
    
    storeElement.textContent = detailDistrict.name;
    descriptionElement.textContent = detailDistrict.description;
    
    const lastSpan = newElement.querySelector("span:last-child");
    
    if (window.loginUser?.isAdmin) {
      const adminRemoveBtn = lastSpan.querySelector("button");
      adminRemoveBtn.addEventListener("click", async(event) => {
        await adminRemoveStore(detailDistrict);
      });
    }
    else {
      lastSpan.style.display = "none";
    }
    
    
    const detailSection = newElement.querySelector(".discover-district-detail-more");
    
    const contactElement = detailSection.querySelector("div:nth-child(1)");
    const websiteElement = detailSection.querySelector("div:nth-child(2)");
    const locationElement = detailSection.querySelector("div:nth-child(3)");
    const googleMapsElement = detailSection.querySelector("div:nth-child(4)");
    
    contactElement.querySelector("dt").textContent = "Contact:";
    contactElement.querySelector("dd").textContent = detailDistrict.contactPhoneNumber;
    
    websiteElement.querySelector("dd > a").textContent = "Website:";
    websiteElement.querySelector("dd > a").href = detailDistrict.website ?? "";
    
    locationElement.querySelector("dt").textContent = "Location:";
    locationElement.querySelector("dd").textContent = detailDistrict.address;
    
    googleMapsElement.querySelector("dd > a").textContent = "Google Maps:";
    googleMapsElement.querySelector("dd > a").href =  detailDistrict.linkGoogleMaps;
    
    discoverContainer.appendChild(newElement);
  }
}

export async function adminRemoveStore(store) {
  try {
    const response = await request(`/districts`, {
      method: "DELETE",
      headers: CreateHeaders.getHeaders(),
      body: JSON.stringify(store),
      signal: signal
    });
    
    const res = await response.json();
    console.log("admin delete reposne", res);
  } catch (e) {
    console.log(e);
  }
}

export async function getDisctrictDetail(district) {
  try {
    const response = await request(`/districts/${district}`, {
      method: "GET",
      headers: CreateHeaders.getHeaders(),
      signal: signal
    });
    
    districtDetailList = await response.json();
    return districtDetailList;
  } catch (e) {
    console.log(e);
  }
}

export async function getDisctrict() {
  try {
    const response = await request("/districts", {
      method: "GET",
      headers: CreateHeaders.getHeaders(),
      signal: signal
    });
    
    districtList = await response.json();
    return districtList;
  } catch (e) {
    console.log(e);
  }
}

export async function getInterestTypes() {
  try {
    const response = await request("/interestType", {
      method: "GET",
      headers: CreateHeaders.getHeaders(),
      signal: signal
    });
    
    return await response.json();
  } catch (e) {
    console.log(e);
  }
}