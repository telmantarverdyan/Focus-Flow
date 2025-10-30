// options/options.js — Hugging Face settings
document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("saveKey").addEventListener("click", saveOptions);

function saveOptions() {
  const apiToken = document.getElementById("hfToken").value.trim();
  const selectedModel = document.getElementById("modelSelect").value;
  
  if (!apiToken) {
    showStatus("⚠️ Please enter a valid Hugging Face token", "error");
    return;
  }

  if (!apiToken.startsWith("hf_")) {
    showStatus("⚠️ Token should start with 'hf_'", "error");
    return;
  }

  chrome.storage.local.set({ 
    HF_API_TOKEN: apiToken,
    HF_MODEL: selectedModel 
  }, () => {
    showStatus("✅ Settings saved successfully!", "success");
    
    // Update background.js model if needed
    chrome.runtime.sendMessage({ 
      type: "update_model", 
      model: selectedModel 
    });
  });
}

function restoreOptions() {
  chrome.storage.local.get(["HF_API_TOKEN", "HF_MODEL"], result => {
    if (result.HF_API_TOKEN) {
      document.getElementById("hfToken").value = result.HF_API_TOKEN;
    }
    if (result.HF_MODEL) {
      document.getElementById("modelSelect").value = result.HF_MODEL;
    }
  });
}

function showStatus(message, type) {
  const status = document.getElementById("status");
  status.textContent = message;
  status.className = `status ${type} show`;
  
  setTimeout(() => {
    status.classList.remove("show");
  }, 3000);
}