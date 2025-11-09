export interface Tool {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: string;
  gradient: string;
  url?: string;
  githubUrl?: string;
  features: string[];
  status: "available" | "coming-soon";
}

export const tools: Tool[] = [
  {
    id: "auto-request-sender",
    name: "Auto Request Sender",
    shortDescription: "Công cụ gửi HTTP requests tự động",
    description:
      "Auto Request Sender là một ứng dụng web mạnh mẽ để gửi HTTP requests với xử lý hàng loạt và hỗ trợ upload file nhiều dòng.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    gradient: "from-blue-500 to-purple-600",
    url: process.env.NEXT_PUBLIC_AUTO_REQUEST_SENDER_URL || "https://auto-request-sender.vercel.app/",
    githubUrl: process.env.NEXT_PUBLIC_AUTO_REQUEST_SENDER_GITHUB || "https://github.com/hieudan26/Auto-Request-Sender",
    features: [
      "Gửi HTTP requests với đầy đủ các phương thức: GET, POST, PUT, PATCH, DELETE",
      "Xử lý hàng loạt với upload file nhiều dòng cho URL, Headers, Params, Body",
      "Parse cURL commands tự động và điền cấu hình request",
      "Bypass CORS với backend proxy tích hợp",
      "Dashboard thống kê chi tiết với success rate, response times",
    ],
    status: "available",
  },
  {
    id: "json-parser",
    name: "JSON Parser",
    shortDescription: "Parse JSON và export sang Excel, TXT, Properties",
    description:
      "JSON Parser là công cụ mạnh mẽ để parse JSON và export sang nhiều định dạng khác nhau: Excel (.xlsx), TXT (với format cột), và Properties files.",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    gradient: "from-green-500 to-emerald-600",
    url: process.env.NEXT_PUBLIC_JSON_PARSER_URL || "http://localhost:3000",
    githubUrl: process.env.NEXT_PUBLIC_JSON_PARSER_GITHUB || "https://github.com/hieudan26/dan-tools",
    features: [
      "Upload file JSON hoặc paste trực tiếp với validation real-time",
      "Export to Excel: field names là columns, mỗi object là một row",
      "Export to TXT: format giống Excel với columns cách nhau bằng |",
      "Export to Properties: chỉ hoạt động với JSON objects (không phải arrays)",
      "Dark mode support với UI hiện đại và responsive",
    ],
    status: "available",
  },
];

