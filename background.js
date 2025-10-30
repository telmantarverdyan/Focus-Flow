// background.js — Focus Flow with Hugging Face API (FIXED)
console.log("✅ Focus Flow background service worker active (Hugging Face)");

// Using a more reliable model endpoint
let HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const responseCache = new Map();

// Show sidebar on extension icon click
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content/sidebar.js"]
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ai_request") {
    handleAIRequest(message.prompt)
      .then(text => sendResponse({ text }))
      .catch(err => {
        console.error("💥 Error in handleAIRequest:", err);
        sendResponse({ text: "⚠️ Error: " + err.message });
      });
    return true;
  }

  if (message.type === "detect_context") {
    detectContext(message.url, message.bodyText)
      .then(context => sendResponse({ context }))
      .catch(err => {
        console.error("💥 Context detection error:", err);
        sendResponse({ context: "reading" });
      });
    return true;
  }

  if (message.type === "update_model") {
    HF_API_URL = `https://api-inference.huggingface.co/models/${message.model}`;
    console.log("✅ Model updated to:", message.model);
    sendResponse({ success: true });
    return true;
  }
});

async function handleAIRequest(promptText) {
  promptText = (promptText || "").trim();
  if (!promptText) return "⚠️ Cannot send empty prompt.";

  // Check cache
  const cacheKey = hashPrompt(promptText);
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("✅ Using cached response");
    return cached.response;
  }

  const apiKey = await getAPIKey();

  // Demo Mode if no API key
  if (!apiKey) {
    console.warn("⚠️ No API key. Using demo mode.");
    return getDemoResponse(promptText);
  }

  try {
    console.log("🔄 Sending request to:", HF_API_URL);
    
    // Hugging Face API call with better formatting
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `<s>[INST] ${promptText} [/INST]`,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false
        },
        options: {
          wait_for_model: true,
          use_cache: false
        }
      })
    });

    console.log("📡 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`💥 Hugging Face API error (${response.status}):`, errorText);
      
      if (response.status === 401) {
        return "⚠️ Invalid API token. Please check your settings.\n\nGo to: chrome://extensions/ → Focus Flow → Options";
      }
      if (response.status === 403) {
        return "⚠️ Access denied. Make sure your token has 'Read' permission.";
      }
      if (response.status === 404) {
        return "⚠️ Model not found. Try changing the model in Options.\n\nRecommended: Switch to 'FLAN-T5 Large' in settings.";
      }
      if (response.status === 429) {
        return "⚠️ Too many requests. Wait 1 minute and try again.";
      }
      if (response.status === 503) {
        return "⚠️ Model is loading (first time takes ~30 seconds).\n\nPlease wait and try again in 20 seconds.";
      }
      
      return `⚠️ API error (${response.status}). Try a different model in Options.`;
    }

    const data = await response.json();
    console.log("✅ Hugging Face response:", data);

    // Handle different response formats
    let output = "";
    
    if (Array.isArray(data) && data.length > 0) {
      // Standard response format
      if (data[0].generated_text) {
        output = data[0].generated_text.trim();
      } else if (data[0].summary_text) {
        output = data[0].summary_text.trim();
      } else if (typeof data[0] === 'string') {
        output = data[0].trim();
      }
    } else if (data.generated_text) {
      // Alternative format
      output = data.generated_text.trim();
    } else if (data.summary_text) {
      // Summary format
      output = data.summary_text.trim();
    } else if (typeof data === 'string') {
      // Direct string response
      output = data.trim();
    } else if (data[0] && data[0].label) {
      // Classification format
      output = `Classification: ${data[0].label} (${(data[0].score * 100).toFixed(1)}%)`;
    }

    if (!output) {
      console.error("❌ Could not extract text from response:", data);
      return "⚠️ No response generated. Try rephrasing or switch to FLAN-T5 model in Options.";
    }

    // Clean up the output
    output = output
      .replace(/^\[INST\].*?\[\/INST\]\s*/gi, '')
      .replace(/^<s>\s*/gi, '')
      .replace(/\s*<\/s>$/gi, '')
      .trim();

    // Cache successful response
    responseCache.set(cacheKey, {
      response: output,
      timestamp: Date.now()
    });

    return output;
  } catch (error) {
    console.error("💥 Network error:", error);
    
    if (error.message.includes("Failed to fetch")) {
      return "⚠️ Network error. Check your internet connection.";
    }
    
    return `⚠️ Error: ${error.message}`;
  }
}

async function detectContext(url, bodyText) {
  url = (url || "").toLowerCase();
  bodyText = (bodyText || "").toLowerCase();

  // Writing indicators
  if (
    url.includes("mail") ||
    url.includes("docs") ||
    url.includes("notion") ||
    url.includes("chat.openai") ||
    url.includes("write") ||
    bodyText.includes("compose") ||
    bodyText.includes("draft")
  ) {
    return "writing";
  }

  // Research indicators
  if (
    url.includes("google.com/search") ||
    url.includes("wikipedia.org") ||
    url.includes("arxiv.org") ||
    url.includes("stackoverflow.com") ||
    url.includes("github.com") ||
    bodyText.includes("compare") ||
    bodyText.includes("vs")
  ) {
    return "research";
  }

  // Default to reading
  return "reading";
}

function getDemoResponse(prompt) {
  const lower = prompt.toLowerCase();
  
  if (lower.includes("task") || lower.includes("todo")) {
    return "• Review project documentation\n• Set up development environment\n• Create initial prototype\n• Write test cases\n• Schedule team sync";
  }
  
  if (lower.includes("summary") || lower.includes("summarize")) {
    return "This content discusses key productivity concepts and strategies for improving focus and workflow efficiency.";
  }
  
  if (lower.includes("improve") || lower.includes("rewrite")) {
    return "Consider breaking this into smaller, actionable steps. Focus on clarity and concrete outcomes.";
  }

  const demoResponses = [
    "Here's a concise analysis of the key points from this content.",
    "The main topics include: productivity optimization, focus management, and workflow automation.",
    "Consider organizing this information into actionable steps for better clarity.",
    "This content suggests prioritizing deep work sessions and minimizing context switching."
  ];
  
  return demoResponses[Math.floor(Math.random() * demoResponses.length)];
}

function hashPrompt(str) {
  let hash = 0;
  for (let i = 0; i < Math.min(200, str.length); i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return String(hash);
}

async function getAPIKey() {
  return new Promise(resolve => {
    chrome.storage.local.get(["HF_API_TOKEN"], result => {
      resolve(result.HF_API_TOKEN || null);
    });
  });
}

// Clear old cache entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of responseCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      responseCache.delete(key);
    }
  }
}, 10 * 60 * 1000);