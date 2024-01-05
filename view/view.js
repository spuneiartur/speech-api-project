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
};
export { generateChatAI, generateChatUser };
