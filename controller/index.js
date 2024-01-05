`use strict`;
import * as Model from "../model/index.js";
import * as View from "../view/view.js";
const wrapper = document.querySelector(".wrapper");

(async () => {
  try {
    const responseFromSpeechAPI = await Model.getResponseFromSpeechAPI();
  } catch (error) {
    console.error("Error:", error);
  }
})();
