document.getElementById('select').addEventListener('click', e => {
    chrome.runtime.sendMessage({data: 'activate'});
    window.close();
});

document.getElementById('remove').addEventListener('click', e => {
    chrome.runtime.sendMessage({data: 'remove'});
    window.close();
});