# Focus Flow — Context-Aware Productivity AI

**AI-powered Chrome extension that detects whether you're reading, writing, or researching and provides contextual AI assistance.**

Built with OpenAI GPT-3.5 integration, featuring a beautiful macOS-inspired floating glass UI.

---

## ✨ Features

- 🧭 **Smart Context Detection** — Automatically identifies reading, writing, or research mode
- 🤖 **AI Assistant** — Ask questions about any webpage, get summaries, extract tasks
- ✅ **Task Management** — Auto-generates actionable tasks from AI responses
- 💾 **Persistent Storage** — Tasks saved per-domain across sessions
- 🎨 **Modern UI** — Floating glass sidebar with auto dark/light mode
- ⚡ **Demo Mode** — Works without API key for testing

---

## 🚀 Quick Start

### 1. Installation
```bash
# Clone repository
git clone https://github.com/yourusername/focus-flow.git
cd focus-flow

# Install dependencies (optional, for development)
npm install
```

### 2. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `focus-flow` directory

### 3. Configure OpenAI API (Optional)

1. Click the Focus Flow icon in Chrome toolbar
2. Go to **Options** (right-click icon → Options)
3. Enter your [OpenAI API key](https://platform.openai.com/api-keys)
4. Click **Save Key**

> **Note:** Extension works in Demo Mode without an API key, but responses will be generic.

---

## 🎯 Usage

### Opening the Sidebar

**Method 1:** Click the Focus Flow icon in your Chrome toolbar

**Method 2:** The sidebar auto-injects on most pages (can be closed with × button)

### Using AI Assistant

1. Type your question in the input field
2. Click **Send** or press Enter
3. AI analyzes the current page + your question
4. Response appears with typing animation
5. Actionable tasks auto-extracted to Focus Tasks section

### Example Queries

- "What are the main points on this page?"
- "Extract all action items from this article"
- "Summarize this in 3 bullet points"
- "What should I focus on first?"

---

## 🛠️ Configuration

### API Settings

**Location:** Right-click extension icon → **Options**

- **OpenAI API Key** — Required for full AI functionality
- Demo mode activates automatically if no key is provided

### Storage

- Tasks stored locally via `chrome.storage.local`
- Separate task lists per domain (e.g., github.com, docs.google.com)
- Clear tasks with **🧹 Clear Tasks** button

---

## 📂 Project Structure
```
focus-flow/
├── manifest.json          # Extension configuration
├── background.js          # AI request handler, context detection
├── content/
│   └── sidebar.js         # Floating UI, task management
├── content.js             # Context detection logic
├── popup/
│   └── index.html         # Extension popup (mode display)
├── options/
│   ├── options.html       # Settings page
│   └── options.js         # Settings logic
└── assets/
    ├── icon16.png
    ├── icon48.png
    ├── icon128.png
    └── apple_icon128.png
```

---

## 🧪 Demo Mode

If no API key is configured, Focus Flow operates in **Demo Mode**:

- ✅ Sidebar UI fully functional
- ✅ Task extraction works
- ✅ Context detection active
- ⚠️ AI responses are pre-generated examples
- ⚠️ No actual OpenAI API calls made

Perfect for testing the UI and workflow before adding an API key!

---

## 🔧 Development

### Prerequisites

- Node.js 18+ (for build tools, optional)
- Chrome 88+ (Manifest V3 support)

### Building from Source
```bash
npm install
npm run build
```

Output in `dist/` directory (if using Vite build process).

### Testing

1. Make changes to source files
2. Go to `chrome://extensions/`
3. Click **Reload** button on Focus Flow card
4. Test changes on any webpage

---

## 🎨 Design Philosophy

- **Non-intrusive** — Sidebar slides in from right, easily dismissible
- **Context-aware** — Adapts detection based on URL patterns and page content
- **Local-first** — All data stored locally, no tracking
- **Fast & responsive** — Caching layer for API responses
- **Accessible** — Full ARIA labels, keyboard navigation

---

## 🐛 Troubleshooting

### Extension not loading

- Check Chrome version (88+)
- Ensure Developer mode enabled
- Try removing and re-adding extension

### AI not responding

- Verify API key in Options page
- Check browser console for errors (F12)
- Confirm network connectivity

### Sidebar not appearing

- Click extension icon manually
- Check if content scripts are blocked on the page (e.g., chrome:// URLs)
- Refresh the page

---

## 📜 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📧 Contact

**Author:** Telman Tarverdyan

For bugs and feature requests, open an issue on GitHub.

---

## 🚀 Roadmap

- [ ] Gemini Nano integration (Chrome built-in AI)
- [ ] Keyboard shortcuts
- [ ] Customizable UI themes
- [ ] Export tasks to Notion/Todoist
- [ ] Multi-language support
- [ ] Voice input
- [ ] Advanced summarization modes

---

**Built with ❤️ for productive browsing**