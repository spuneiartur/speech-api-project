`use strict`;
import * as Model from "../model/index.js";

const wrapper = document.querySelector(".wrapper");

 //wrapper.textContent = ` ${Model.getResponseFromOpenAI()} - ${Model.getResponseFromSpeechAPI()}`;
//console.log(Model.getResponseFromOpenAI);
//console.log(Model.getResponseFromSpeechAPI);
(async () => {
    try {
        const responseFromSpeechAPI = await Model.getResponseFromSpeechAPI();
    } catch (error) {
      console.error('Error:', error);
    }
  })();