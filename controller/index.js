`use strict`;
import * as Model from "../model/index.js";
import * as View from "../view/view.js";
const wrapper = document.querySelector(".wrapper");

//wrapper.textContent = ` ${Model.getResponseFromOpenAI()} - ${Model.getResponseFromSpeechAPI()}`;
//console.log(Model.getResponseFromOpenAI);
//console.log(Model.getResponseFromSpeechAPI);
// (async () => {
//   try {
//     const responseFromSpeechAPI = await Model.getResponseFromSpeechAPI();
//   } catch (error) {
//     console.error("Error:", error);
//   }
// })();
console.log("gegeagea");
View.generateChatUser("Hello from user");
View.generateChatAI("Hello from AI");
View.generateChatUser("How are you");
