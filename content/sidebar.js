function initSidebar() {
  // ----------------------------
  // 🧭 Focus Flow Sidebar Script - macOS 26 Flat Glass Floating UI
  // ----------------------------

  function typeText(element, text, delay = 25) {
    element.classList.add("typing");
    element.innerHTML = "";
    let i = 0;
    const interval = setInterval(() => {
      element.innerHTML += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        element.classList.remove("typing");
      }
    }, delay);
  }

  // Mode detection with refined logic
  function detectMode() {
    const url = window.location.href.toLowerCase();
    if (url.includes("wikipedia") || url.includes("news")) return "Research Mode";
    if (document.querySelector("textarea, input[type='text'], input[type='email'], input[type='search']")) return "Writing Mode";
    if (url.includes("youtube") || url.includes("medium")) return "Reading Mode";
    return "Focus Mode";
  }

  // Inject sidebar HTML
  const sidebar = document.createElement("aside");
  sidebar.id = "focusflow-sidebar";
  sidebar.setAttribute("role", "complementary");
  sidebar.setAttribute("aria-label", "Focus Flow Sidebar");
  sidebar.innerHTML = `
    <header id="ff-header" role="banner">
      <span><img src="${chrome.runtime.getURL('assets/apple_icon128.png')}" alt="Focus Flow Icon" width="20" height="20" loading="lazy" decoding="async"> Focus Flow</span>
      <button id="ff-close" aria-label="Close Focus Flow Sidebar" title="Close">×</button>
    </header>
    <section id="ff-body" role="main">
      <p id="ff-mode" aria-live="polite" aria-atomic="true">🧭 ${detectMode()}</p>
      <textarea id="ff-input" placeholder="Ask AI about this page..." aria-label="Input your question"></textarea>
      <button id="ff-send" aria-label="Send your question">Send</button>
      <output id="ff-output" aria-live="polite" aria-atomic="false"></output>
    </section>
  `;
  document.body.appendChild(sidebar);

  // Inject styles for macOS 26 flat glass floating UI with SF Pro fonts and auto dark/light mode
  const style = document.createElement("style");
  style.textContent = `
    /* Reset and base */
    #focusflow-sidebar {
      position: fixed;
      top: 50%;
      right: 0;
      transform: translate(100%, -50%);
      width: 320px;
      max-height: 90vh;
      background: rgba(255 255 255 / 0.6);
      backdrop-filter: saturate(180%) blur(24px);
      -webkit-backdrop-filter: saturate(180%) blur(24px);
      border-radius: 16px 0 0 16px;
      border-left: 1px solid rgba(0 0 0 / 0.1);
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      color: #1c1c1e;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      z-index: 1000000;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
      opacity: 0;
      user-select: text;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      overflow: hidden;
      box-shadow: none;
    }
    #focusflow-sidebar.open {
      transform: translate(0, -50%);
      opacity: 1;
    }

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      #focusflow-sidebar {
        background: rgba(28 28 30 / 0.6);
        border-left: 1px solid rgba(255 255 255 / 0.12);
        color: #f0f0f5;
      }
    }

    /* Header */
    #ff-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      font-weight: 600;
      font-size: 16px;
      user-select: none;
      border-bottom: 1px solid rgba(0 0 0 / 0.08);
      background: transparent;
    }
    @media (prefers-color-scheme: dark) {
      #ff-header {
        border-bottom: 1px solid rgba(255 255 255 / 0.12);
      }
    }
    #ff-header span {
      display: flex;
      align-items: center;
      gap: 8px;
      color: inherit;
      font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
    #ff-header img {
      border-radius: 5px;
      box-shadow: none;
      display: block;
      height: 20px;
      width: 20px;
      object-fit: contain;
    }
    #ff-close {
      background: transparent;
      border: none;
      font-size: 24px;
      line-height: 1;
      color: #6e6e73;
      cursor: pointer;
      border-radius: 8px;
      padding: 0 6px;
      transition: color 0.25s ease;
      user-select: none;
      font-weight: 700;
      font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
    #ff-close:hover,
    #ff-close:focus {
      color: #007aff;
      outline: none;
      background: rgba(0 122 255 / 0.15);
    }

    /* Body */
    #ff-body {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      padding: 12px 20px 20px;
      overflow: hidden;
    }
    #ff-mode {
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 8px;
      color: #5c5c5e;
      user-select: none;
      font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
    }

    /* Textarea */
    #ff-input {
      width: 100%;
      height: 48px;
      padding: 8px 12px;
      font-size: 15px;
      font-weight: 400;
      font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
      color: #1c1c1e;
      background: rgba(118 118 128 / 0.1);
      border: none;
      border-radius: 12px;
      box-shadow: inset 0 1px 2px rgba(0 0 0 / 0.08);
      resize: none;
      outline-offset: 2px;
      outline-color: transparent;
      transition: background-color 0.3s ease, box-shadow 0.3s ease, outline-color 0.3s ease;
      user-select: text;
    }
    #ff-input::placeholder {
      color: #8e8e93;
      font-weight: 400;
    }
    #ff-input:focus {
      background: rgba(142, 142, 147, 0.08);
      box-shadow: inset 0 0 0 2px #8e8e93;
      outline-color: #8e8e93;
    }
    @media (prefers-color-scheme: dark) {
      #ff-input {
        background: rgba(84 84 88 / 0.35);
        color: #f0f0f5;
        box-shadow: inset 0 1px 2px rgba(0 0 0 / 0.5);
      }
      #ff-input::placeholder {
        color: #c7c7cc;
      }
      #ff-input:focus {
        background: rgba(160, 160, 165, 0.15);
        box-shadow: inset 0 0 0 2px #a0a0a5;
        outline-color: #a0a0a5;
      }
      #ff-mode {
        color: #d1d1d3;
      }
    }

    /* Send button */
    #ff-send {
      margin-top: 12px;
      width: 100%;
      padding: 12px 0;
      background: linear-gradient(180deg, #c7c7cc 0%, #8e8e93 100%);
      border: none;
      border-radius: 12px;
      color: #fff;
      font-weight: 600;
      font-size: 15px;
      letter-spacing: 0.2px;
      cursor: pointer;
      user-select: none;
      box-shadow: none;
      transition: background-color 0.25s ease, transform 0.2s ease;
      font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
    #ff-send:hover,
    #ff-send:focus {
      background: linear-gradient(180deg, #b2b2b8 0%, #7a7a7e 100%);
      outline: none;
      transform: translateY(-1px);
    }
    #ff-send:active {
      background: #5c5c5e;
      transform: translateY(0);
    }

    /* Output */
    #ff-output {
      margin-top: 16px;
      flex: 1 1 auto;
      overflow-y: auto;
      font-size: 15px;
      line-height: 1.5;
      white-space: pre-wrap;
      color: inherit;
      font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
      user-select: text;
      padding-right: 2px;
    }
    #ff-output.typing {
      opacity: 0.9;
    }

    /* Scrollbar for output */
    #ff-output::-webkit-scrollbar {
      width: 6px;
    }
    #ff-output::-webkit-scrollbar-thumb {
      background: rgba(0 122 255 / 0.3);
      border-radius: 3px;
    }
    #ff-output::-webkit-scrollbar-track {
      background: transparent;
    }

    /* Focus Tasks container */
    #ff-tasks {
      border-top: 1px solid rgba(0 0 0 / 0.1);
      padding: 14px 20px;
      background: rgba(118 118 128 / 0.06);
      font-size: 14px;
      border-radius: 0 0 16px 16px;
      font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
      color: #1c1c1e;
      max-height: 160px;
      overflow-y: auto;
      user-select: text;
    }
    @media (prefers-color-scheme: dark) {
      #ff-tasks {
        background: rgba(84 84 88 / 0.25);
        color: #f0f0f5;
        border-top: 1px solid rgba(255 255 255 / 0.12);
      }
    }
    #ff-tasks label {
      display: block;
      margin: 6px 0;
      cursor: pointer;
      user-select: none;
      font-weight: 500;
      color: inherit;
    }
    #ff-tasks input[type="checkbox"] {
      margin-right: 8px;
      cursor: pointer;
      accent-color: #8e8e93;
      vertical-align: middle;
      width: 16px;
      height: 16px;
    }

    /* Clear tasks button */
    #ff-clear-tasks {
      margin-top: 12px;
      padding: 8px 14px;
      border: none;
      background: #ff3b30;
      color: white;
      border-radius: 14px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      box-shadow: none;
      transition: background-color 0.3s ease;
      user-select: none;
      font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
    #ff-clear-tasks:hover,
    #ff-clear-tasks:focus {
      background: #d32f2f;
      outline: none;
    }
    #ff-clear-tasks:active {
      background: #b02626;
    }

    /* Minimal typing glow */
    #ff-output.typing {
      opacity: 0.85;
    }
  `;
  document.head.appendChild(style);

  // Show sidebar with animation after style is applied
  setTimeout(() => sidebar.classList.add("open"), 50);

  // ----------------------------
  // 💾 Persistent Task Storage
  // ----------------------------

  const STORAGE_KEY = `focusflow_${location.hostname}`;

  // Load saved tasks when sidebar opens
  loadSavedTasks();

  // Listen for checkbox changes and save
  document.addEventListener("change", (e) => {
    if (e.target && e.target.closest("#ff-tasks input[type='checkbox']")) {
      saveTasks();
    }
  });

  // Listen for Clear Tasks button
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "ff-clear-tasks") {
      chrome.storage.local.remove(STORAGE_KEY, () => {
        const taskBox = document.getElementById("ff-tasks");
        if (taskBox) {
          taskBox.innerHTML = "<b>✅ Focus Tasks</b><br><i>All tasks cleared.</i>";
        }
      });
    }
  });

  function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#ff-tasks label").forEach(label => {
      const text = label.textContent.trim();
      const checkbox = label.querySelector("input");
      const checked = checkbox ? checkbox.checked : false;
      tasks.push({ text, checked });
    });
    chrome.storage.local.set({ [STORAGE_KEY]: tasks });
  }

  function loadSavedTasks() {
    chrome.storage.local.get([STORAGE_KEY], (data) => {
      const saved = data[STORAGE_KEY];
      if (saved && saved.length) {
        const taskBoxId = "ff-tasks";
        let taskBox = document.getElementById(taskBoxId);
        if (!taskBox) {
          taskBox = document.createElement("div");
          taskBox.id = taskBoxId;
          taskBox.style.padding = "14px 20px";
          taskBox.style.borderTop = "1px solid rgba(255,255,255,0.1)";
          taskBox.style.fontSize = "14px";
          sidebar.appendChild(taskBox);
        }

        taskBox.innerHTML = "<b>✅ Focus Tasks</b><br>" +
          saved.map(t => `<label>
            <input type='checkbox' ${t.checked ? "checked" : ""} aria-checked="${t.checked ? "true" : "false"}"/> ${t.text}
          </label>`).join("") +
          `<button id="ff-clear-tasks" aria-label="Clear all tasks" title="Clear all tasks">
            🧹 Clear Tasks
          </button>`;
      }
    });
  }

  // Handle send button click
  document.getElementById("ff-send").addEventListener("click", async () => {
    const input = document.getElementById("ff-input").value.trim();
    const output = document.getElementById("ff-output");
    if (!input) return;

    const pageText = document.body.innerText.slice(0, 3000);
    const fullPrompt = `${input}\n\nHere is the visible content of the page:\n${pageText}`;
    output.innerHTML = "⏳ Thinking...";

    // --- 🧩 Demo Mode ---
    const DEMO_MODE = false; // set to true during live presentation
    if (DEMO_MODE) {
      const demoText = "• Identify productivity challenges\n• Design Focus Flow UI\n• Record demo video";
      output.innerHTML = "";
      typeText(output, demoText);
      generateTasks(demoText);
      return;
    }

    try {
      // --- 🧠 Send prompt to background (AI API call happens there) ---
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
          { type: "ai_request", prompt: fullPrompt },
          (response) => {
            if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
            else resolve(response);
          }
        );
      });

      if (!response || !response.text) {
        output.innerHTML = "⚠️ No response received from background.";
      } else {
        typeText(output, response.text);
        generateTasks(response.text);
      }
    } catch (err) {
      output.innerHTML = "⚠️ Error: " + err.message;
    }
  });

  // Close button
  document.getElementById("ff-close").addEventListener("click", () => sidebar.remove());

  // --- ✅ Focus Tasks Generator ---
  function generateTasks(aiText) {
    const taskBoxId = "ff-tasks";
    let taskBox = document.getElementById(taskBoxId);
    if (!taskBox) {
      taskBox = document.createElement("div");
      taskBox.id = taskBoxId;
      taskBox.style.padding = "14px 20px";
      taskBox.style.borderTop = "1px solid rgba(255,255,255,0.1)";
      taskBox.style.fontSize = "14px";
      sidebar.appendChild(taskBox);
    }

    // Split on newlines or common bullet characters, trim, filter empty
    const lines = aiText.split(/\n|•|-|\*/).map(l => l.trim()).filter(Boolean);
    // Verbs to identify clear tasks (case insensitive)
    const verbs = /^(create|build|fix|test|review|research|write|plan|record|summarize|design|check|improve|develop|organize|prepare|draft|edit|compile|update|analyze|evaluate|deploy|document|schedule|prioritize|refactor|train|investigate|optimize|implement|collaborate|present|finalize|deliver)/i;
    const tasks = lines.filter(line => verbs.test(line));

    if (tasks.length) {
      taskBox.innerHTML = "<b>✅ Focus Tasks</b><br>" +
        tasks.map(t => `<label>
        </label>`).join("");
      // Save newly generated tasks
      saveTasks();
    } else {
      taskBox.innerHTML = "<b>✅ Focus Tasks</b><br><i>No clear tasks found.</i>";
    }
  }
}

// Ensure DOM is ready before injecting
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSidebar);
} else {
  initSidebar();
}
