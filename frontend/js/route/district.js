"use strict";
import CreateHeaders from "../util/headerManager.js"
import request from "../util/request.js"

const controller = new AbortController();
const signal = controller.signal;

export async function getDisctrict() {
  try {
    const response = await request("/districts", {
      method: "GET",
      headers: CreateHeaders.getHeaders(),
      signal: signal
    });
    
    const data = await response.json()
    
    console.log(data);
  } catch (e) {
    console.log(e);
  }
}