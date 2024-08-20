chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ threshold: 50, enabled: true }, () => {
      console.log("Extension installed: default threshold is 50% and enabled.");
    });
});