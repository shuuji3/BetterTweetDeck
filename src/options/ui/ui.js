// Since this hack might be used only on Chrome, it's fine
chrome.tabs.create({ url: chrome.runtime.getURL('options/options.html') });
window.close();
