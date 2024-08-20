chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ threshold: 50, enabled: true }, () => {
      console.log("Extension installed: default threshold is 50% and enabled.");
  });
});

// 메시지를 수신하고 처리하는 리스너 추가
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.html) {
      sendToServer(request.url, request.html, sender.tab.id); // tab.id를 전달
  }
});

// HTML과 URL을 외부 서버로 전송하는 함수
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
      
      // 임계값 비교
      chrome.storage.sync.get(['threshold'], (result) => {
          const threshold = result.threshold;
          const site_threshold = data[1]
          // 배열 1번 값이 임계값보다 낮은 경우
          if ((site_threshold * 100) < threshold) {
              console.log("res",(site_threshold * 100));
              console.log("thr", threshold);
              // blocked.html로 리디렉션
              chrome.tabs.update(tabId, { url: chrome.runtime.getURL('blocked/blocked.html') + '?originalUrl=' + encodeURIComponent(url) });
          }
      });
  })
  .catch((error) => console.error('Error:', error));
}
