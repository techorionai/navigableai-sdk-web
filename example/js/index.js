"use strict";

const navigableai = new NavigableAI({
  id: "navigableai-chat",
  apiConfig: {
    sendMessage: {
      url: "http://localhost:4000/assistant/send-message",
      method: "POST",
    },
    getMessages: {
      url: "http://localhost:4000/assistant/get-messages",
      method: "GET",
    },
  },
  actions: {
    "Contact Support": () => {
      console.log("Contact Support"); // Replace with logic to handle the action
    },
  },
  markdown: true,
});

document.querySelector("#open-button")?.addEventListener("click", () => {
  console.log("Button clicked");
  navigableai.chatWindow.open();
});

document.querySelector("#toggle-button")?.addEventListener("click", () => {
  console.log("Button toggled");
  navigableai.chatWindow.toggle();
});

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    navigableai.chatWindow.open();
  }
};
