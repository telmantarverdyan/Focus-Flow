// content.js — Enhanced context detection with page analysis
console.log("✅ Focus Flow content script loaded");

let currentContext = "reading";
let lastDetectionTime = 0;
const DETECTION_COOLDOWN = 3000; // 3 seconds

async function detectContext() {
  const now = Date.now();
  if (now - lastDetectionTime < DETECTION_COOLDOWN) {
    return; // Avoid excessive detection calls
  }
  lastDetectionTime = now;

  try {
    const url = window.location.href;
    const bodyText = document.body.innerText.slice(0, 2000).toLowerCase();
    
    // Ask background to classify
    chrome.runtime.sendMessage(
      { type: "detect_context", url, bodyText },
      (response) => {
        if (response && response.context) {
          currentContext = response.context;
          chrome.storage.local.set({ currentContext });
          console.log("🧭 Context detected:", currentContext);
          
          // Emit custom event for UI updates
          window.dispatchEvent(new CustomEvent('focusflow:contextchange', {
            detail: { context: currentContext }
          }));
        }
      }
    );
  } catch (err) {
    console.error("❌ Context detection error:", err);
  }
}

// Detect on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', detectContext);
} else {
  detectContext();
}

// Re-detect on significant DOM changes (throttled)
let mutationTimeout;
const observer = new MutationObserver(() => {
  if (mutationTimeout) clearTimeout(mutationTimeout);
  mutationTimeout = setTimeout(detectContext, 5000);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Re-detect on focus change
let focusTimeout;
document.addEventListener('focusin', () => {
  if (focusTimeout) clearTimeout(focusTimeout);
  focusTimeout = setTimeout(detectContext, 1000);
});

// Listen for manual refresh requests
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.action === "refreshContext") {
    detectContext();
    sendResponse({ status: "refreshing" });
  }
  return true;
});