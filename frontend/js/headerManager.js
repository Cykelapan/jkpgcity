"use strict";
function CreateHeaders() {
  const myHeaders = new Headers();
  
  myHeaders.append('Accept', 'application/json');
  myHeaders.append('Content-Type', 'application/json');
  
  this.addAuth = (bearer_token) => {
    if (!bearer_token) {
      return console.error("NO BEARER TOKEN");
    }
    myHeaders.append('Authorization', bearer_token);
  }
  
  const validate = (type, value) => {
    if (typeof type !== "string") {
      return false
    }
    if (typeof value !== "string") {
      return false
    }
    return true
  }
  
  this.add = (type, value) => {
    if (!validate(type, value)) { return this }
    myHeaders.append(type, value);
    return this;
  }
  
  this.exist = (type) => {
    if (!validate(type, "")) { return false }
    
    return myHeaders.get(type) !== null;
  }
  
  this.update = (type, value) => {
    if (!validate(type, value)) { return this }
    if (myHeaders.get(type) === value) { return this; }
    
    this.delete(type);
    myHeaders.append(type, value);
    
    return this;
  }
  
  this.delete = (type) => {
    if (!validate(type, "")) { return this }
    myHeaders.delete(type);
    return this;
  }
  
  this.getHeaders = () => {
    return myHeaders
  }
}

export default CreateHeaders