# FetchXmlTester
###### Test FetchXml Online without providing credentials using WebAPI GET Call

[![GitHub Pages](https://img.shields.io/badge/Hosted%20On-GitHub%20Pages-blue.svg)](https://www.ashishvishwakarma.com/FetchXmlTester/)
[![Dataverse](https://img.shields.io/badge/Microsoft-Dataverse%20Web%20API-0078D4.svg)](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/overview)

**Tool Link**: [https://www.ashishvishwakarma.com/FetchXmlTester/](https://www.ashishvishwakarma.com/FetchXmlTester/)

FetchXML Tester Online is a client-side developer tool for Microsoft Dataverse & Dynamics 365 to test, format, and execute FetchXML queries directly in your browser using native WebAPI GET requests without sharing or storing credentials.

---

## 🌟 Key Features

1. **FetchXML Syntax Highlighting**: Clean syntax styling with XML tag, attribute, and value formatting.
2. **Zero-Credential Execution**: Executes queries directly against your active Microsoft Dataverse / Dynamics 365 session via native browser Single Sign-On (SSO).
3. **Smart Entity Pluralization**: Automatically identifies the entity name from `<entity name='...'>` and suggests the matching Dataverse Web API entity collection set name.
4. **Environment Context Studio**: Save and switch between multiple Dataverse environments with shared local storage parity (`lsOrgURLs` and `qdv_active_env`).
5. **Inbuilt XML Beautifier & Formatter**: Clean, indent, and format FetchXML with a single click or keyboard shortcut.
6. **URL Querystring Deep-Linking & File Loading**: Load remote query files, inline FetchXML, or full Web API URLs via URL parameters.
7. **One-Click Sharable Deep Links**: Share any query, environment, and friendly name with a single click (`Ctrl+Shift+S`).
8. **Saved Queries Library**: Persist frequently used queries in browser local storage with instant search, load, and JSON export.
9. **Local File Loading & Download**: Open `.xml` or `.txt` files from disk (`Ctrl+O`) and export queries.
10. **Dark & Light Mode**: Seamless theme switching with persistent preferences.

---

## 🔗 URL Querystring Deep-Linking & File Loading

FetchXML Tester features URL query string loading capabilities with complete parity to [WebAPI Tester Studio](https://github.com/AshV/webapi-tester), enabling query sharing, automated documentation links, and remote file loading directly into the tester.

### Supported URL Parameters

| Parameter | Example | Behavior |
| :--- | :--- | :--- |
| **`?load=`** / **`?url=`** / **`?file=`** / **`?src=`** | `?load=https://example.com/query.xml`<br>`?load=sample.xml` | Fetches any public FetchXML query file (including relative paths). Automatically extracts query name from filename and formats the query into the editor. |
| **`?query=`** / **`?q=`** / **`?fetchxml=`** / **`?xml=`** | `?query=%3Cfetch%20mapping%3D%27logical%27%3E...%3C%2Ffetch%3E` | Directly populates the editor from a URL-encoded FetchXML string OR a full Dataverse Web API request URL (e.g. `https://org.crm.dynamics.com/api/data/v9.2/accounts?fetchXml=...`). When a Web API URL is provided, the environment and plural collection are automatically detected and configured. |
| **`?env=`** / **`?org=`** | `?env=https://contoso.crm.dynamics.com` | Automatically connects to and activates the specified Dataverse tenant in the Environment Manager. |
| **`?name=`** / **`?title=`** | `?name=Active%20Accounts` | Sets the query title and updates the browser tab title (`fX: <name>`). |
| **`?plural=`** / **`?entity=`** | `?plural=accounts` | Explicitly preconfigures the entity plural collection name. |

### Smart GitHub Link Transformation
If a GitHub repository link is passed (e.g. `https://github.com/user/repo/blob/main/query.xml` or raw link / Gist), FetchXML Tester automatically transforms it to `https://raw.githubusercontent.com/user/repo/main/query.xml` for direct, CORS-friendly client-side loading.

### One-Click Sharable Link Generator
Click the **Share** button on the toolbar (or press `Ctrl+Shift+S`) to generate an all-inclusive deep link that preserves:
1. Current FetchXML query (`query`)
2. Connected Dataverse organization (`env`)
3. Query name and description (`name`)
4. Entity plural name (`plural`)

Example generated shareable link:
```
https://www.ashishvishwakarma.com/FetchXmlTester/?query=%3Cfetch%20mapping%3D%27logical%27%3E%3Centity%20name%3D%27account%27%3E%3Cattribute%20name%3D%27name%27%2F%3E%3C%2Fentity%3E%3C%2Ffetch%3E&env=https%3A%2F%2Fcontoso.crm.dynamics.com&name=Active%20Accounts&plural=accounts
```

### Local File Picker
Click the **Open File** button on the toolbar (or press `Ctrl+O`) to pick and load any local `.xml` or `.txt` FetchXML query file from your computer.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl / Cmd + Enter` | **Test FetchXML**: Execute query against active Dataverse environment |
| `Ctrl / Cmd + Shift + S` | **Share Link**: Copy one-click sharable URL with query, environment & name |
| `Ctrl / Cmd + Shift + F` / `Alt + Shift + F` | **Beautify**: Format and indent FetchXML |
| `Ctrl / Cmd + S` | **Save to Library**: Save current query to local browser library |
| `Ctrl / Cmd + O` | **Open File**: Load FetchXML query from local file |
| `Ctrl / Cmd + K` | **Environment Manager**: Open Environment Context Studio |
| `Escape` | Close any active modal dialog |

---

## 🔒 Privacy & Security

This tool runs 100% client-side. All processing (parsing, validation, formatting, and storage) happens locally in your browser. Queries are executed directly against your Dataverse instance using your browser's existing authenticated session. No credentials or data are sent to any external server or third-party proxy.

---

## 💡 Tips & References

- Recommended extension: [JSON Viewer PRO](https://chrome.google.com/webstore/detail/json-viewer-pro/eifflpmocdbdmepbjaopkkhbfmdgijcc) for formatting raw Dataverse JSON responses.
- Dynamics 365 Web API Concept: [How FetchXML works with Web API GET calls](https://AshishVishwakarma.com/test-fetchxml-with-webapi-dynamics-365-fetchxml-tester/)
- Companion OData Studio: [WebAPI Tester Studio](https://www.ashishvishwakarma.com/webapi-tester/)

---

## 📄 License

MIT License &copy; [Ashish Vishwakarma](https://www.ashishvishwakarma.com/)
