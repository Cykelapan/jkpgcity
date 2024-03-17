"use strict";
import CreateHeaders from "../util/headerManager.js"
import request from "../util/request.js"

const discoverHeadline = document.querySelector(".discover-district-headline");
const discoverContainer = document.querySelector("[data-source=discover] > .discover-district");
const discover_template = document.querySelector("#discover-template");
const discover_detail_template = document.querySelector("#discover-detail-template");

const controller = new AbortController();
const signal = controller.signal;

let districtList = [];
let districtDetailList = [];

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

export function districtDetailGenerateView() {
  while (discoverContainer.hasChildNodes()) {
    discoverContainer.removeChild(discoverContainer.firstChild);
  }
  
  for (let detailDistrict of districtDetailList) {
    const newElement = discover_detail_template.content.cloneNode(true);
    
    const storeElement = newElement.querySelector("strong");
    const descriptionElement = newElement.querySelector("small");
    
    storeElement.textContent = detailDistrict.name
    descriptionElement.textContent = detailDistrict.description
    
    const detailSection = newElement.querySelector(".discover-district-detail-more");
    
    const contactElement = detailSection.querySelector("div:nth-child(1)");
    const websiteElement = detailSection.querySelector("div:nth-child(2)");
    const locationElement = detailSection.querySelector("div:nth-child(3)");
    const googleMapsElement = detailSection.querySelector("div:nth-child(4)");
    
    contactElement.querySelector("dt").textContent = "Contact:"
    contactElement.querySelector("dd").textContent = detailDistrict.contactPhoneNumber
    
    websiteElement.querySelector("dd > a").textContent = "Website:"
    websiteElement.querySelector("dd > a").href = detailDistrict.website
    
    locationElement.querySelector("dt").textContent = "Location:"
    locationElement.querySelector("dd").textContent = detailDistrict.address
    
    googleMapsElement.querySelector("dd > a").textContent = "Google Maps:"
    googleMapsElement.querySelector("dd > a").href =  detailDistrict.linkGoogleMaps
    
    discoverContainer.appendChild(newElement);
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