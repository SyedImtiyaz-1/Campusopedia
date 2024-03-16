const chatbotToggle = document.querySelector(".chatbot__button");
const sendChatBtn = document.querySelector(".chatbot__input-box span");
const chatInput = document.querySelector(".chatbot__textarea");
const chatBox = document.querySelector(".chatbot__box");
const chatbotCloseBtn = document.querySelector(".chatbot__header span");

const inputInitHeight = chatInput.scrollHeight;
const API_URL = '/ask'; // Endpoint on your server to handle the chatbot question

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chatbot__chat", className);
  chatLi.innerHTML = `<p>${message}</p>`;
  return chatLi;
};

const handleChat = async () => {
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  chatBox.appendChild(createChatLi(userMessage, "outgoing"));
  chatBox.scrollTo(0, chatBox.scrollHeight);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: userMessage,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch response');
    }

    const data = await response.json();
    const botResponse = data.response;
    chatBox.appendChild(createChatLi(botResponse, "incoming"));
    chatBox.scrollTo(0, chatBox.scrollHeight);
  } catch (error) {
    console.error("API error:", error);
    const errorMessage = "Server Down, Please try again after sometime !";
    chatBox.appendChild(createChatLi(errorMessage, "error"));
    chatBox.scrollTo(0, chatBox.scrollHeight);
  }
};

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

chatbotToggle.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);

chatbotCloseBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);

sendChatBtn.addEventListener("click", handleChat);
