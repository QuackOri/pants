console.log('Test message from content script.');

chrome.storage.sync.get(['enabled'], function(result) {
    if (result.enabled) {
        console.log("send");
        const currentUrl = window.location.href;
        const pageHtml = document.documentElement.outerHTML;

        // background으로 메시지 전송
        chrome.runtime.sendMessage({ url: currentUrl, html: pageHtml });
    }
});
