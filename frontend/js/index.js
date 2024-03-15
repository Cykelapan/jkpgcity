// AbortController - is for cancelling fetch request
const controller = new AbortController();
const signal = controller.signal;

const district = document.querySelector("#district-api");
const api_result = document.querySelector("#api_result")

district.addEventListener("click", async () => {
  try {
    const response = await fetch("/district", { signal });
    console.log("Fetch complete", response);
    api_result.textContent = "Got API Response, look web console"
  } catch (error) {
    console.error(`Fetch error: ${error.message}`);
    api_result.textContent = error.message
  }
});