"use strict";

const navigableai = new NavigableAI({
  embedId: "<your embed id>",

  actions: {
    "Contact Support": () => {
      console.log("Contact Support"); // Replace with logic to handle the action
    },
  },

  markdown: true,
  widgetButtonPosition: "bottom-left",
  // darkTheme: true,
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
