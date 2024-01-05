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
  
  // Get the canvas and its context
  const canvas = document.getElementById('canvas');
  const canvasCtx = canvas.getContext('2d');

  // Create an audio context
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Create an analyser node
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function draw() {
    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
    canvasCtx.beginPath();

    const sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;

    for(let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * canvas.height / 2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  }

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
     //const responseFromOpenAI = await getResponseFromOpenAI(finalTranscript);
     //console.log(responseFromOpenAI);
     
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
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(stream => {
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      draw();
      setTimeout(() => {
        source.disconnect(analyser);
        stream.getTracks().forEach(track => track.stop());
      }, 5000);
    })
    .catch(err => console.error(err));

    //makes the speech recognition stop after 5 seconds
    setTimeout(() => recognition.stop(), 5000);
  };
};

//getResponseFromSpeechAPI();