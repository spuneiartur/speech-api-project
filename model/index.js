`use strict`;
import { OPENAI_TOKEN, OPENAI_API_URL } from "../constants.js";

export const getResponseFromOpenAI = async (questionFromSpeechAPI) => {
  const response = await axios.post(
    `${OPENAI_API_URL}`,
    {
      prompt: questionFromSpeechAPI,
      max_tokens: 100,
      temperature: 0.3,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.choices[0].text;
 
  
  
};

export const getResponseFromSpeechAPI = () => {
  let recognition;
  let recognizing = false;
  let finalTranscript = '';
  
  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
      recognizing = true;
    };

    recognition.onerror = function(event) {
      console.error(event.error);
    };

    recognition.onend = async function() {
      recognizing = false;
      const responseFromOpenAI = await getResponseFromOpenAI(finalTranscript );
      console.log(responseFromOpenAI);
    };
    recognition.onresult = async function(event) {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript = event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
     
     document.querySelector('#chat__inputt .input').value=finalTranscript ;
    
     
    };
  } else {
    console.log('webkitSpeechRecognition is not available');
  }

  document.getElementById('start_button').onclick = function() {
    if (recognizing) {
      recognition.stop();
      return;
    }
    recognition.lang = 'en-US';
    recognition.start();
    //makes the speech recognition stop after 5 seconds
    setTimeout(() => recognition.stop(), 5000);
  };
};

//getResponseFromSpeechAPI();