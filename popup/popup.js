document.getElementById('fixed').addEventListener('click', e => {
    chrome.runtime.sendMessage({data: 'fixed'});
    window.close();
});

document.getElementById('absolute').addEventListener('click', e => {
    chrome.runtime.sendMessage({data: 'absolute'});
    window.close();
});

document.getElementById('remove').addEventListener('click', e => {
    chrome.runtime.sendMessage({data: 'remove'});
    window.close();
});