# Auto Request Sender - Backend

Simple Node.js backend server to proxy HTTP requests and bypass CORS restrictions.

## Installation

```bash
cd backend
npm install
```

## Running

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

Server will run on `http://localhost:3001`

## API Endpoints

### POST /api/proxy

Proxy HTTP request to bypass CORS.

**Request Body:**
```json
{
  "url": "https://api.example.com/endpoint",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json"
  },
  "params": {
    "key": "value"
  },
  "body": "{\"key\":\"value\"}",
  "bodyType": "json"
}
```

**Response:**
```json
{
  "status": 200,
  "statusText": "OK",
  "headers": {},
  "data": {}
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Proxy server is running"
}
```
