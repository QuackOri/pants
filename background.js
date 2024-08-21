chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ threshold: 70, enabled: true, blocked: true }, () => {
    console.log("Extension installed: default threshold is 70% and enabled.");
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.html) {
      sendToServer(request.url, request.html, sender.tab.id);
  }
});

function sendToServer(url, htmlContent, tabId) {
  fetch('http://uskawjdu.iptime.org:8080/predict', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: url, html: htmlContent })
  })
  .then(response => response.json())
  .then(data => {
        console.log('Success:', data);

        const predictedValue = (data[1] * 100).toFixed(1);
        chrome.runtime.sendMessage({ action: 'updatePrediction', value: predictedValue });
        console.log('after send');
    
        chrome.storage.sync.get(['threshold'], (result) => {
        const threshold = result.threshold;
        if (predictedValue > threshold) {
            console.log("res", predictedValue);
            console.log("thr", threshold);
            chrome.tabs.get(tabId, (tab) => {
                if (chrome.runtime.lastError || !tab) {
                    console.error('탭이 존재하지 않거나 오류가 발생했습니다:', chrome.runtime.lastError);
                } else {
                    chrome.tabs.update(tabId, { url: chrome.runtime.getURL('blocked/blocked.html') + '?originalUrl=' + encodeURIComponent(url) });
                }
            });
        } else if (data[2] === false) {
            chrome.tabs.get(tabId, (tab) => {
                if (chrome.runtime.lastError || !tab) {
                    console.error('탭이 존재하지 않거나 오류가 발생했습니다:', chrome.runtime.lastError);
                } else {
                    chrome.tabs.update(tabId, { url: chrome.runtime.getURL('blocked/warning.html') });
                }
            });
        }
    });

    //   if (data[2] === false) {
    //     chrome.tabs.get(tabId, (tab) => {
    //         if (chrome.runtime.lastError || !tab) {
    //             console.error('탭이 존재하지 않거나 오류가 발생했습니다:', chrome.runtime.lastError);
    //         } else {
    //             chrome.tabs.update(tabId, { url: chrome.runtime.getURL('blocked/warning.html') });
    //         }
    //       });
    //   } else {
    //     chrome.storage.sync.get(['threshold'], (result) => {
    //         const threshold = result.threshold;
    //         const site_threshold = data[1];
    //         if ((site_threshold * 100) > threshold) {
    //             console.log("res", (site_threshold * 100));
    //             console.log("thr", threshold);
                
    //             chrome.tabs.get(tabId, (tab) => {
    //                 if (chrome.runtime.lastError || !tab) {
    //                     console.error('탭이 존재하지 않거나 오류가 발생했습니다:', chrome.runtime.lastError);
    //                 } else {
    //                     chrome.tabs.update(tabId, { url: chrome.runtime.getURL('blocked/blocked.html') + '?originalUrl=' + encodeURIComponent(url) });
    //                 }
    //             });
    //         }
    //     });
    //   }
  })
  .catch((error) => console.error('Error:', error));
}
