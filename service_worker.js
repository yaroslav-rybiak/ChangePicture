let currentImageSrc;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "changePicture",
    title: "Change picture",
    contexts: ["image"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "changePicture") {
    currentImageSrc = info.srcUrl;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["change_picture.js"],
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.newSrc) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { newSrc: request.newSrc, oldSrc: currentImageSrc });
    });
  }
});
