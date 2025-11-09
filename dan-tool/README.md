# Dan Tools

Landing page cho bộ công cụ developer tools.

## Tính năng

- Landing page đơn giản, thân thiện
- Giới thiệu các tools hiện có
- Links có thể cấu hình qua environment variables
- Responsive design
- Dark mode support

## Cài đặt

```bash
npm install
```

## Cấu hình

Tạo file `.env.local` từ `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Chỉnh sửa các biến môi trường trong `.env.local`:

```
NEXT_PUBLIC_AUTO_REQUEST_SENDER_URL=https://auto-request-sender.vercel.app/
NEXT_PUBLIC_AUTO_REQUEST_SENDER_GITHUB=https://github.com/hieudan26/Auto-Request-Sender
```

## Chạy ứng dụng

Development:

```bash
npm run dev
```

Build production:

```bash
npm run build
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## Công nghệ sử dụng

- **Next.js 14**: React framework với App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **React 18**: UI library

