"use strict";
import CreateHeaders from "./headerManager.js"

async function sideEffect(response) {
  const bearer_token = response.headers.get('Authorization');
  
  if (!bearer_token) { return; }
  
  CreateHeaders.addAuth(bearer_token);
}

async function request(url, config) {
  const response = await fetch(url, config);
  
  sideEffect(response);
  
  return response;
}
 
export default request