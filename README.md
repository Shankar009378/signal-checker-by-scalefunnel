# Signal Checker by Scale Funnel

A Chrome Extension that audits LinkedIn student profiles and generates a **Signal Score** out of 100 to help students identify gaps and improve their professional presence.

---

## Overview

Signal Checker analyzes the visible content of any LinkedIn profile and scores it across six dimensions:

| Dimension          | Max Points |
|--------------------|-----------|
| Headline Analysis  | 20        |
| Profile Photo      | 10        |
| Featured Section   | 20        |
| About Section      | 15        |
| Experience Section | 20        |
| Projects Section   | 15        |
| **Total**          | **100**   |

Based on the score, the extension highlights strengths, weaknesses, and actionable recommendations — all running locally in the browser.

---

## Features

- **One-click audit** — Click the extension icon on any LinkedIn profile
- **Signal Score** — Numeric score out of 100 with color-coded ring (Red/Orange/Green)
- **Strengths & Weaknesses** — Auto-generated from profile analysis
- **Recommendations** — Actionable suggestions to improve the profile
- **Low-score CTA** — If score < 70, displays a "Book a Profile Fix Session" CTA linking to [scalefunnel.in](https://scalefunnel.in)
- **Zero data storage** — No tracking, analytics, or external requests
- **100% local** — All analysis runs inside the extension

---

## Installation

### From the Chrome Web Store (once published)

1. Visit the Chrome Web Store listing
2. Click **Add to Chrome**
3. Click **Add Extension** in the prompt

### Manual Installation (Developer Mode)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer mode** (toggle in top-right)
4. Click **Load unpacked**
5. Select the extension folder (the one containing `manifest.json`)
6. The extension is now installed and ready to use

---

## Local Testing

1. Pin the extension to your toolbar (click the puzzle icon → pin **Signal Checker**)
2. Navigate to any LinkedIn profile page (e.g., `https://www.linkedin.com/in/username/`)
3. Click the **Signal Checker** icon
4. The popup will analyze the profile and display the results

### Testing Notes

- The extension only works on LinkedIn profile pages (URLs containing `/in/`)
- Make sure the profile page has fully loaded before clicking the icon
- If the popup shows an error, try refreshing the LinkedIn page and clicking again

---

## Folder Structure

```
signal-checker/
├── manifest.json          # Extension manifest (V3)
├── assets/
│   ├── icon16.png         # 16x16 toolbar icon
│   ├── icon48.png         # 48x48 extensions page icon
│   └── icon128.png        # 128x128 store listing icon
├── content/
│   └── content.js         # LinkedIn DOM scraper
├── popup/
│   ├── popup.html         # Popup HTML
│   ├── popup.css          # Popup styles (dark SaaS UI)
│   └── popup.js           # Scoring engine + UI logic
└── README.md
```

---

## Permissions

The extension requests the **minimum permissions required**:

| Permission       | Reason                                                      |
|------------------|-------------------------------------------------------------|
| `activeTab`      | Read the currently active LinkedIn profile page             |
| `scripting`      | Inject content script logic when needed                     |
| `linkedin.com/*` | Host permission to run on LinkedIn profile URLs             |

No personal data is collected, stored, or transmitted.

---

## Privacy

- **No data storage** — No local storage, cookies, or IndexedDB
- **No tracking** — No analytics or telemetry
- **No external requests** — The only external link is the CTA button (https://scalefunnel.in) opened in a new tab when clicked
- **No background processing** — No persistent background service workers
- **Everything runs locally** — All analysis happens in your browser on the current page's DOM

---

## Troubleshooting

| Issue                        | Solution                                                     |
|------------------------------|--------------------------------------------------------------|
| "Not a LinkedIn Profile"     | Navigate to a profile URL containing `/in/`                  |
| "Unable to Analyze"          | Refresh the LinkedIn page and try again                      |
| Popup doesn't open           | Check that extension is enabled in `chrome://extensions`     |
| No data extracted            | LinkedIn may have changed their DOM — contact maintainer     |
| Scores seem wrong            | The analysis depends on visible content — scroll through the entire profile before analyzing |

---

## Build Process

No build step is required. The extension is written in vanilla HTML, CSS, and JavaScript.

1. Clone or download the repository
2. Load as an unpacked extension (see **Manual Installation** above)
3. Make changes to the source files as needed
4. Reload the extension in `chrome://extensions` (click the refresh icon on the Signal Checker card)

---

## Chrome Web Store Submission

### 1. Package the Extension

```bash
# Navigate to the extension directory
cd signal-checker

# Create a ZIP file
zip -r signal-checker.zip manifest.json assets/ content/ popup/ README.md
```

### 2. Create a Developer Account

1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Sign in with your Google account
3. Pay the **one-time registration fee** ($5 USD as of 2024)
4. Accept the developer agreement

### 3. Upload the Extension

1. Click **New item** on the dashboard
2. Upload the `signal-checker.zip` file
3. Wait for the upload to complete

### 4. Create the Store Listing

| Field              | Content                                                     |
|--------------------|-------------------------------------------------------------|
| Language           | English                                                     |
| Title              | Signal Checker by Scale Funnel                              |
| Description        | Analyze LinkedIn profiles and get a Signal Score out of 100. Identify strengths, weaknesses, and actionable improvements to stand out to recruiters. |
| Category           | Productivity                                                |
| Rating             | Everyone                                                    |

### 5. Screenshots & Images

| Asset              | Requirements                                                |
|--------------------|-------------------------------------------------------------|
| Store icon         | 128x128 PNG (already in `assets/icon128.png`)               |
| Screenshot (1)     | 1280x800 or 640x400 showing the popup with a score          |
| Screenshot (2)     | 1280x800 or 640x400 showing the CTA card                    |
| Promotional tile   | Optional — 440x280 small tile                                |
| Marquee            | Optional — 1400x560 large tile                               |

### 6. Privacy Policy

Since the extension does **not** collect any user data, you can state:

> **Privacy Policy**  
> Signal Checker does not collect, store, or transmit any personal data. All analysis is performed locally within the browser on the current LinkedIn profile page. No data is sent to any server.

Or use Google's [Privacy Policy Generator](https://www.privacypolicygenerator.info/) for a formal policy hosted online.

### 7. Permjustifications

In the "Permissions Justification" section, explain:

- **activeTab**: Required to read the visible content of the currently active LinkedIn profile page.
- **scripting**: Required to inject the content script that extracts profile data from the LinkedIn DOM.
- **Host permission (linkedin.com/*)**: Required to run the extension on LinkedIn profile pages.

### 8. Review Process

- Google will automatically scan the extension for malware and policy violations
- Review typically takes 1–3 business days
- You will receive an email when the review is complete
- If rejected, read the feedback, fix the issues, and re-upload

### 9. Publishing

- Once approved, click **Publish** on the dashboard
- The extension will go live immediately or within a few hours
- You can update the listing at any time by uploading a new ZIP

---

## License

MIT — Free to use, modify, and distribute.

---

## Support

For issues, feature requests, or questions, visit [scalefunnel.in](https://scalefunnel.in).
