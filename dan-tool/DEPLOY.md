# Deployment Guide for Dan Tool

## Vercel Deployment

1. **Connect your repository** to Vercel
2. **Project Settings:**
   - Framework Preset: **Next.js** (or Auto-detect)
   - Build Command: Leave empty (default: `npm run build`)
   - Output Directory: **Leave empty** (Vercel auto-detects `.next`)
   - Install Command: Leave empty (default: `npm install`)
   - Root Directory: `dan-tool` (if deploying from monorepo)

3. **Environment Variables** (if needed):
   - `NEXT_PUBLIC_AUTO_REQUEST_SENDER_URL` (optional)
   - `NEXT_PUBLIC_AUTO_REQUEST_SENDER_GITHUB` (optional)
   - `NEXT_PUBLIC_JSON_PARSER_URL` (optional)
   - `NEXT_PUBLIC_JSON_PARSER_GITHUB` (optional)

4. **Deploy**

## Important Notes

- Do NOT set Output Directory to `public` - Vercel will auto-detect `.next` for Next.js
- The `public` folder is for static assets, not the build output
- Next.js build output goes to `.next` directory

