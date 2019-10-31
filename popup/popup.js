document.getElementById('select').addEventListener('click', e => {
    chrome.runtime.sendMessage({data: 'activate'});
    window.close();
});