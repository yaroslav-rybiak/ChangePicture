function applyImageChanges(imageChanges) {
    if (imageChanges) {
      const images = document.querySelectorAll('img');
      imageChanges.forEach(({ oldSrc, newSrc, url }) => {
        if (window.location.href === url) {
          images.forEach((img) => {
            if (img.src === oldSrc) {
              img.src = newSrc;
            }
          });
        }
      });
    }
  }
  
  chrome.storage.local.get("imageChanges", ({ imageChanges }) => {
    applyImageChanges(imageChanges);
  
    // Send a message to the parent window to apply image changes
    if (window.self !== window.top) {
      window.top.postMessage({ type: 'applyImageChanges', imageChanges }, '*');
    }
  });
  
  // Listen for messages from iframes
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'applyImageChanges') {
      applyImageChanges(event.data.imageChanges);
    }
  });
  
  // Observe changes in the DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" || mutation.type === "attributes") {
        chrome.storage.local.get("imageChanges", ({ imageChanges }) => {
          applyImageChanges(imageChanges);
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src"],
  });