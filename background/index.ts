chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return
  chrome.tabs.sendMessage(tab.id, { type: "NECTA_TOGGLE" }, () => {
    if (chrome.runtime.lastError) {
      // content script not injected yet — ignore
    }
  })
})
