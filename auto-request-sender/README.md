# Auto Request Sender

A powerful web application for sending HTTP requests with batch processing, multi-line file upload support, and real-time response monitoring.

## Features

### 🚀 Core Features

- **HTTP Request Builder**: Configure GET, POST, PUT, PATCH, DELETE requests with full control over headers, query parameters, and body
- **cURL Parser**: Automatically parse cURL commands and populate request configuration
- **CORS Bypass**: Built-in backend proxy to bypass CORS restrictions
- **Real-time Monitoring**: Live progress updates and response tracking
- **Statistics Dashboard**: Comprehensive statistics including success rate, response times, and requests per second
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Fully responsive UI that works on desktop, tablet, and mobile devices

### 📁 Batch Processing with File Upload

- **Multi-line File Support**: Upload text files containing multiple values for any field (URL, Headers, Params, Body)
- **Per-Field File Upload**: Each field (header, parameter, body field) can have its own file upload
- **Automatic Request Count**: Total number of requests is automatically calculated based on the field with the maximum number of lines
- **Value Fallback**: If a field has fewer lines than the maximum, the last value is used for remaining requests
- **Auto Configuration**: When files are uploaded:
  - `Total Requests` is automatically set based on max lines
  - `Concurrent Connections` is automatically set to 1
  - Both fields are disabled and show calculated values

### 📝 Request Configuration

#### URL Input
- Support for direct URL input or cURL command
- File upload for multiple URLs (one URL per line)
- Automatic cURL detection and parsing
- URL preview with query parameters

#### Headers
- Add/remove custom headers
- Enable/disable headers individually
- File upload for header values (multiple values per header)
- Key-value pair management

#### Query Parameters
- Dynamic query parameter management
- File upload for parameter values
- Automatic URL construction with query string
- Enable/disable parameters individually

#### Request Body
- **Body Types**:
  - JSON: Edit as raw JSON or individual fields
  - Form Data: Key-value pairs for form submission
  - Raw Text: Plain text body (disabled when file uploaded)
- **File Upload Support**: Upload files for body field values
- **Mode Switching**: Toggle between JSON editor and Fields editor
- **Auto-disable**: Body type selector and mode toggles are disabled when files are uploaded

### ⚙️ Execution Control

- **Delay Between Batches**: Configurable delay (0-10000ms) between request batches
- **Concurrent Connections**: Number of simultaneous connections (auto-set to 1 when files uploaded)
- **Total Requests**: Total number of requests to send (auto-calculated from max lines when files are uploaded)
- **Start/Stop Control**: Start, pause, and stop request execution
- **Real-time Progress**: Live progress bar showing sent/total requests and percentage

### 📊 Response Display

- **Response List**: View all responses with status codes, response times, and preview
- **Detailed View**: Expand responses to see full headers, body, and metadata
- **Statistics Panel**:
  - Total requests sent
  - Success/Error counts
  - Success rate percentage
  - Average/Min/Max response times
  - Requests per second
- **Export Options**: Export statistics as JSON or CSV

### 🎨 User Interface

- **Modern Design**: Clean, intuitive interface with gradient accents
- **Responsive Layout**: Optimized for all screen sizes
- **Dark Mode**: Full dark mode support with smooth transitions
- **Visual Feedback**: Color-coded status indicators, progress bars, and badges
- **Accessibility**: Keyboard navigation and screen reader support

### 🔧 Advanced Features

- **Local Storage**: Automatic saving of configuration and settings
- **Reset All**: One-click reset to clear all data and return to default state
- **File Management**: Easy file upload and removal with visual indicators
- **Request Validation**: Input validation and error handling
- **Direct HTTP Requests**: Send requests directly from browser or via backend proxy

## Project Structure

```
cursor_rules/
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── stores/        # Zustand state management
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript type definitions
│   └── ...
├── backend/          # Node.js + Express backend
│   ├── server.js     # Main server file
│   └── ...
└── README.md
```

## Technology Stack

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Zustand**: State management
- **Tailwind CSS**: Styling
- **Axios**: HTTP client for sending requests

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **Axios**: HTTP client for proxying requests

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cursor_rules
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
node server.js
```
The backend will run on `http://localhost:3001` (or port specified in environment)

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173` (or port specified by Vite)

3. Open your browser and navigate to the frontend URL

## Usage Guide

### Basic Request

1. Enter a URL in the URL input field
2. Select HTTP method (GET, POST, PUT, PATCH, DELETE)
3. Add headers, parameters, or body as needed
4. Configure execution settings (delay, concurrency, total requests)
5. Click "Start" to begin sending requests

### Batch Processing with Files

1. **Upload URL File**:
   - Click "Upload" button next to URL input
   - Select a text file with one URL per line
   - The input will show "X URLs" and be disabled

2. **Upload Header Values**:
   - Click "Upload" button next to any header value input
   - Select a text file with one value per line
   - The input will show "X values" and be disabled

3. **Upload Parameter Values**:
   - Click "Upload" button next to any parameter value input
   - Select a text file with one value per line
   - The input will show "X values" and be disabled

4. **Upload Body Field Values**:
   - Click "Upload" button next to any body field value input
   - Select a text file with one value per line
   - Body type selector will be disabled
   - The input will show "X values" and be disabled

5. **Automatic Configuration**:
   - Total Requests will automatically calculate from the field with most lines
   - Concurrent Connections will automatically set to 1
   - Both fields will be disabled and show calculated values

### cURL Import

1. Paste a cURL command into the URL input field
2. Click "Parse cURL" button
3. The application will automatically extract:
   - URL
   - Method
   - Headers
   - Body (if present)

### CORS Bypass

1. Enable "Use Backend Proxy" in CORS Bypass section
2. Configure proxy URL (default: backend API endpoint)
3. All requests will be proxied through the backend to bypass CORS

### Monitoring and Statistics

- View real-time progress in the progress bar
- Check individual responses in the Response List
- Monitor overall statistics in the Statistics panel
- Export statistics as JSON or CSV

### Reset All Data

- Click "Reset All" button in the header
- Confirm the action
- All configuration, responses, and statistics will be cleared

## File Format

### Text Files for Batch Processing

Upload text files with one value per line. Empty lines are automatically filtered out.

**Example URL file (`urls.txt`)**:
```
https://api.example.com/users/1
https://api.example.com/users/2
https://api.example.com/users/3
```

**Example Header Values file (`tokens.txt`)**:
```
Bearer token1
Bearer token2
Bearer token3
```

**Example Parameter Values file (`ids.txt`)**:
```
123
456
789
```

## API Endpoints

### Backend API

- `POST /api/proxy`: Proxy a single request
- `POST /api/batch`: Start batch processing
- `GET /health`: Health check endpoint


## Configuration

### Environment Variables

#### Frontend
- `VITE_BACKEND_URL`: Backend API URL (default: `http://localhost:3001/api/proxy`)

#### Backend
- `PORT`: Server port (default: `3001`)
- `CORS_ORIGIN`: Allowed CORS origin (default: `*`)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[Specify your license here]

## Support

For issues, questions, or contributions, please open an issue on the repository.
