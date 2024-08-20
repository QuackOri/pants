const urlParams = new URLSearchParams(window.location.search);
const originalUrl = urlParams.get('originalUrl');
const tabID = Date.now(); // 현재 시간을 사용하여 고유한 ID 생성
const redirectedTabs = JSON.parse(localStorage.getItem("redirectedTabs")) || [];

// 현재 탭의 ID가 이미 리디렉션된 탭 목록에 있는지 확인
if (!redirectedTabs.includes(tabID)) {
    redirectedTabs.push(tabID);
    localStorage.setItem("redirectedTabs", JSON.stringify(redirectedTabs));
    
    setTimeout(() => {
        chrome.storage.sync.set({blocked: false}); 
        if (originalUrl) {
            window.location.href = decodeURIComponent(originalUrl);
        } else {
            window.history.back();
        }
    }, 3000);
}