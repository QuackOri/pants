console.log('Test message from content script.');

chrome.storage.sync.get(['enabled', 'blocked'], function(result) {
    if (result.enabled && result.blocked) {
        console.log("send");
        const currentUrl = window.location.href;
        const pageHtml = document.documentElement.outerHTML;

        chrome.runtime.sendMessage({ url: currentUrl, html: pageHtml });
    }
});

chrome.storage.sync.set({blocked: true});