function sendMessageToCurrent(msg) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            data: msg
        });
    });
}

chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (request.data == 'fixed' || request.data == 'absolute' || request.data == 'remove') {
        sendMessageToCurrent(request.data);
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // EVERY REDIRECTION STARTS WITH A COMPLETE STATUS FOR SOME REASON.
    if (tab.status && tab.status == 'complete') {
        chrome.tabs.sendMessage(tabId, {
            data: 'complete'
        });
    }
});