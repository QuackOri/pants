chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ threshold: 50, enabled: true }, () => {
      console.log("Extension installed: default threshold is 50% and enabled.");
  });
});

// 메시지를 수신하고 처리하는 리스너 추가
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.html) {
      sendToServer(request.url, request.html);
  }
});

// HTML과 URL을 외부 서버로 전송하는 함수
function sendToServer(url, htmlContent) {
  fetch('http://uskawjdu.iptime.org:8080/predict', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: url, html: htmlContent })
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch((error) => console.error('Error:', error));
}
