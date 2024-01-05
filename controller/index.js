`use strict`;
const OPENAI_TOKEN = "";
const OPENAI_API_URL = "https://api.openai.com/v1/engines/davinci/completions";

const generateChatAI = (text) => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Formatting the hours and minutes with leading zeros if needed
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Creating the final formatted time string
  const formattedTime = `${formattedHours}:${formattedMinutes}`;
  const chat = `<article class="msg-remote">
  <div class="msg-box">
    <div class="flr">
      <div class="messages">
        <p class="msg" id="msg-1">${text}</p>
      </div>
      <span class="timestamp"
        ><span class="username">OpenAI</span>&bull;<span
          class="posttime"
          >${formattedTime}</span
        ></span
      >
    </div>
    <img
      class="user-img"
      id="user-0"
      src="../assets/images/cat.png"
    />
  </div>
</article>`;
  const chatBox = document.querySelector(".chat__box");

  chatBox.innerHTML += chat;
  chatBox.scrollTop = chatBox.scrollHeight;
};

const generateChatUser = (text) => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Formatting the hours and minutes with leading zeros if needed
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Creating the final formatted time string
  const formattedTime = `${formattedHours}:${formattedMinutes}`;
  const chat = `<article class="msg-self">
    <div class="msg-box">
      <div class="flr">
        <div class="messages">
          <p class="msg" id="msg-1">${text}</p>
         
        </div>
        <span class="timestamp"
          ><span class="username">User</span>&bull;<span
            class="posttime"
            >${formattedTime}</span
          ></span
        >
      </div>
      <img
        class="user-img"
        id="user-0"
        src="../assets/images/avatar.png"
      />
    </div>
  </article>`;

  const chatBox = document.querySelector(".chat__box");
  chatBox.innerHTML += chat;
  chatBox.scrollTop = chatBox.scrollHeight;
};

const getResponseFromOpenAI = async (questionFromSpeechAPI) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: questionFromSpeechAPI,
      max_tokens: 100,
      temperature: 0.3,
    }),
  };

  try {
    const response = await fetch(OPENAI_API_URL, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData.choices[0].text;
    // Handle responseData as needed
  } catch (error) {
    console.error("Fetch error:", error.message);
  }

  return "Sorry, an error occured on the AI side";
};

const getResponseFromSpeechAPI = () => {
  let recognition;
  let recognizing = false;

  let finalTranscript = "";

  // Get the canvas and its context
  const canvas = document.getElementById("canvas");
  const canvasCtx = canvas.getContext("2d");

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

    canvasCtx.fillStyle = "rgb(200, 200, 200)";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(0, 0, 0)";
    canvasCtx.beginPath();

    const sliceWidth = (canvas.width * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  }

  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function () {
      recognizing = true;
    };

    recognition.onerror = function (event) {
      console.error(event.error);
    };

    recognition.onend = async function () {
      recognizing = false;
      generateChatUser(finalTranscript);
      document.getElementById("start_button").disabled = true;
      document.getElementById("start_button").classList.add("disabled");
      const responseFromOpenAI = await getResponseFromOpenAI(finalTranscript);
      generateChatAI(responseFromOpenAI);
      document.getElementById("start_button").disabled = false;
      document.getElementById("start_button").classList.remove("disabled");
    };
    recognition.onresult = async function (event) {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript = event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      document.querySelector("#chat__inputt .input").value = finalTranscript;
    };
  } else {
    console.log("webkitSpeechRecognition is not available");
  }

  document.getElementById("start_button").onclick = function () {
    if (recognizing) {
      recognition.stop();
      return;
    }
    recognition.lang = "en-US";
    recognition.start();
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        draw();
        setTimeout(() => {
          source.disconnect(analyser);
          stream.getTracks().forEach((track) => track.stop());
        }, 5000);
      })
      .catch((err) => console.error(err));

    //makes the speech recognition stop after 5 seconds
    setTimeout(() => {
      recognition.stop();
    }, 5000);
  };
};

(async () => {
  try {
    getResponseFromSpeechAPI();
  } catch (error) {
    console.error("Error:", error);
  }
})();
