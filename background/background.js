chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (request.data == 'activate') {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            console.log(tabs);
            chrome.tabs.sendMessage(tabs[0].id, {
                data: 'activate'
            });
        });
    } else if (request.data == 'newdiv') {
        chrome.storage.local.get(['list'], result => {
            if (result.list) {
                result.list.push(request.obj);
                chrome.storage.local.set({
                    list: result.list
                }, () => {
                    if (chrome.runtime.lastError) {
                        console.log('ERROR while saving:');
                        console.log(chrome.runtime.lastError);
                    } else {
                        console.log('Succesfully saved.');
                    }
                });
            } else {
                chrome.storage.local.set({
                    list: [request.obj]
                }, () => {
                    if (chrome.runtime.lastError) {
                        console.log('ERROR while saving:');
                        console.log(chrome.runtime.lastError);
                    } else {
                        console.log('Succesfully saved.');
                    }
                });
            }
        });
    }
});

chrome.tabs.onUpdated.addListener((tabid, changeInfo, tab) => {
    if (tab.url) {
        chrome.storage.local.get(['list'], result => {
            if (result.list) {
                for (let i = 0; i < result.list.length; i++) {
                    if (tab.url.includes(result.list[i].website)) {
                        chrome.tabs.sendMessage(tabid, {data: 'showdiv', obj: result.list[i]})
                    }
                }
            }
        });
    }
});