"use strict";

const navigableai = new NavigableAI({
  embedId: "<your embed id>",

  actions: {
    "Contact Support": () => {
      console.log("Contact Support"); // Replace with logic to handle the action
    },
    "Sign Up": () => {
      console.log("Sign Up"); // Replace with logic to handle the action
    },
    "View Pricing": () => {
      console.log("View Pricing"); // Replace with logic to handle the action
    },
  },

  markdown: true,
  widgetButtonPosition: "bottom-left",
  // darkTheme: true,

  welcomeMessage:
    "Hi, I'm Navi, the AI Assistant for Navigable AI. I can guide you through the Navigable AI platform by suggesting actions to perform.",
  welcomeActions: ["Contact Support", "Sign Up", "View Pricing"],
});

// Override the default goTo for actions with path (string) instead of function handler
// navigableai.goTo = (path) => alert(path);

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
