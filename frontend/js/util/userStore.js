"use strict";
import CreateHeaders from "./headerManager.js"
import request from "./request.js"
import {
  getDisctrict,
  getDisctrictDetail,
  districtGenerateView
} from "../route/district.js"

const controller = new AbortController();
const signal = controller.signal;

const userStore = document.querySelector("#user-store-template");
const userStoreContainer = document.querySelector(".user-store-entry");

export async function userStoreGenerateView() {
  while (userStoreContainer.hasChildNodes()) {
    userStoreContainer.removeChild(userStoreContainer.firstChild);
  }

  const districts = await getDisctrict();
  const userStores = await getDisctrictDetail(districts[0]);
  // const userStores = await getUserData();

  for (let store of userStores ?? []) {
    const newElement = userStore.content.cloneNode(true);

    const form = newElement.querySelector(".updateStoreForm");

    const removeBtn = newElement.querySelector("span:last-child > button");

    removeBtn.addEventListener("click", async (event) => {
      await userDeleteStore(data);
    });

    const header = newElement.querySelector("h3");

    header.querySelector("strong").textContent = store.name;
    header.querySelector("small").textContent = store.description;

    const details = newElement.querySelector(".discover-district-detail-more");

    const storeName = details.querySelector("div:nth-child(1)");
    const description = details.querySelector("div:nth-child(2)");

    const contact = details.querySelector("div:nth-child(3)");
    const website = details.querySelector("div:nth-child(4)");
    const address = details.querySelector("div:nth-child(5)");
    const district = details.querySelector("div:nth-child(6)");

    const googleMaps = details.querySelector("div:nth-child(7)");
    const google_id = details.querySelector("div:nth-child(9)");

    storeName.querySelector("input").value = store.name;
    description.querySelector("input").value = store.description;
    contact.querySelector("input").value = store.contactPhoneNumber;
    website.querySelector("input").value = store.website;
    googleMaps.querySelector("input").value = store.linkGoogleMaps;

    for (let districtNames of districts) {
      const option = document.createElement("option");
      option.value = districtNames;
      option.textContent = districtNames;
      district.appendChild(option);
    }

    const addressFormat = store.address.split(",");
    address.querySelector("input:nth-child(1)").value = addressFormat[0];
    address.querySelector("input:nth-child(2)").value = addressFormat[1];
    address.querySelector("input:nth-child(3)").value = addressFormat[2];

    google_id.querySelector("input").value = store.google_id;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const parseForm = new FormData(event.target);
      const data = Object.fromEntries(parseForm);

      let postResponse = await postUserData(data);
      console.log(postResponse);
    });

    userStoreContainer.appendChild(newElement);
  }

  const createStoreForm = userStore.content.cloneNode(true);
  const form = createStoreForm.querySelector(".updateStoreForm");

  const details = createStoreForm.querySelector(".discover-district-detail-more");
  const district = details.querySelector("div:nth-child(6)");

  for (let districtNames of districts) {
    const option = document.createElement("option");
    option.value = districtNames;
    option.textContent = districtNames;
    district.appendChild(option);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const parseForm = new FormData(event.target);
    const data = Object.fromEntries(parseForm);

    let postResponse = await postUserData(data);
    console.log(postResponse);
  });
  userStoreContainer.appendChild(createStoreForm);
}

export async function userDeleteStore(data) {
  try {
    const response = await request("/userpage", {
      method: "DELETE",
      headers: CreateHeaders.getHeaders(),
      body: JSON.stringify(data),
      signal: signal
    });

    return await response.json();
  } catch (error) {
    console.error(`Fetch userpage post error: ${error.message}`);
    return null;
  }
}

export async function getUserData() {
  try {
    const response = await request("/userpage", {
      method: "GET",
      headers: CreateHeaders.getHeaders(),
      signal: signal
    });

    return await response.json();
  } catch (error) {
    console.error(`Fetch userpage get error: ${error.message}`);
    return null;
  }
}

export async function postUserData(data) {
  try {
    const response = await request("/userpage", {
      method: "POST",
      headers: CreateHeaders.getHeaders(),
      body: JSON.stringify(data),
      signal: signal
    });

    return await response.json();
  } catch (error) {
    console.error(`Fetch userpage post error: ${error.message}`);
    return null;
  }
}
