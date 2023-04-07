chrome.runtime.sendMessage({ imageSrc: document.activeElement.src });

(async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      chrome.runtime.sendMessage({ newSrc: dataUrl });
    };
    reader.readAsDataURL(file);
  };
  input.click();
})();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.newSrc && request.oldSrc) {
    const targetImg = document.querySelector(`img[src="${request.oldSrc}"]`);
    if (targetImg) {
      targetImg.src = request.newSrc;

      // Save the image change in storage
      const imageChange = {
        oldSrc: request.oldSrc,
        newSrc: request.newSrc,
        url: window.location.href,
      };

      chrome.storage.local.get("imageChanges", ({ imageChanges }) => {
        imageChanges = imageChanges || [];
        imageChanges.push(imageChange);
        chrome.storage.local.set({ imageChanges });
      });
    }
  }
});
