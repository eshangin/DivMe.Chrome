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
    if (request.data == 'activate') {
        sendMessageToCurrent('draw');
    } else if (request.data == 'remove') {
        sendMessageToCurrent('remove');
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status && changeInfo.status == 'complete') {
        sendMessageToCurrent('newURL')
    }
})