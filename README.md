# Dan Tools

A collection of useful tools for developers, featuring modern web tools built with Next.js, React, and TypeScript.

## 🛠️ Tools

### 1. Auto Request Sender
A powerful tool for sending HTTP requests automatically with batch processing and multi-line file upload support.

**Features:**
- Send HTTP requests with all methods: GET, POST, PUT, PATCH, DELETE
- Batch processing with multi-line file upload for URL, Headers, Params, Body
- Automatic cURL command parsing and request configuration
- CORS bypass with integrated backend proxy
- Detailed statistics dashboard with success rate and response times

**Tech Stack:** React + Vite + TypeScript + Tailwind CSS

**Links:**
- [GitHub](https://github.com/hieudan26/Auto-Request-Sender)
- [Live Demo](https://auto-request-sender.vercel.app/)

---

### 2. JSON Parser
A powerful tool for parsing JSON and exporting to multiple formats.

**Features:**
- Upload JSON file or paste directly with real-time validation
- Export to Excel: field names as columns, each object as a row
- Export to TXT: Excel-like format with columns separated by `|`
- Export to Properties: only works with JSON objects (not arrays)
- Dark mode support with modern and responsive UI

**Tech Stack:** Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + XLSX

**Links:**
- [GitHub](https://github.com/hieudan26/dan-tools)
- [Live Demo](http://localhost:3000) (when running locally)

---

### 3. Dan Tool (Main Dashboard)
Main dashboard to manage and access all tools.

**Tech Stack:** Next.js + React + TypeScript + Tailwind CSS

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.19.0 (recommended >= 20.9.0 for Next.js 16)
- npm or yarn

### Installation

#### Auto Request Sender

```bash
cd auto-request-sender/frontend
npm install
npm run dev
```

Backend (if needed):
```bash
cd auto-request-sender/backend
npm install
npm start
```

#### JSON Parser

```bash
cd json-parser
npm install
npm run dev
```

#### Dan Tool (Main Dashboard)

```bash
cd dan-tool
npm install
npm run dev
```

## 📁 Project Structure

```
dan-tools/
├── auto-request-sender/     # Auto Request Sender tool
│   ├── frontend/            # React frontend
│   └── backend/              # Node.js backend
├── json-parser/             # JSON Parser tool
├── dan-tool/                # Main dashboard
└── README.md                # This file
```

## 🛠️ Tech Stack

- **Frontend Frameworks:** Next.js 16, React 19, Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand (Auto Request Sender)
- **File Processing:** XLSX (JSON Parser)

## 📝 License

MIT

## 👤 Author

**Dan Hieu Nguyen**
- GitHub: [@hieudan26](https://github.com/hieudan26)

---

Made with ❤️ by Dan Hieu Nguyen
