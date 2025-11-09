# Auto Request Sender - Frontend

Frontend application for automatically sending HTTP requests with customizable headers, body, parameters, and execution controls.

## Installation

```bash
cd frontend
npm install
```

## Environment Variables

Create `.env.development` for development and `.env.production` for production:

```bash
VITE_BACKEND_URL=http://localhost:3001/api/proxy
```

- Development: Uses `.env.development` (default: `http://localhost:3001/api/proxy`)
- Production: Uses `.env.production` (set your production backend URL)

## Development

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Build

```bash
npm run build
```

## Backend

Make sure to start the backend server (see `../backend/README.md`) if you want to use CORS bypass feature.

Backend runs on `http://localhost:3001` by default (configurable via env variables).

