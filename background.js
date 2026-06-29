chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  try {
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ["content.css"]
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.__loveDaisyPetalGame?.toggle()
    });
  } catch (error) {
    console.warn("Love Daisy could not open on this page.", error);
  }
});
