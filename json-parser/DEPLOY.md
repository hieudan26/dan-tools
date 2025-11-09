# Deployment Guide for JSON Parser

## Vercel Deployment

1. **Connect your repository** to Vercel
2. **Project Settings:**
   - Framework Preset: **Next.js** (or Auto-detect)
   - Build Command: Leave empty (default: `npm run build`)
   - Output Directory: **Leave empty** (Vercel auto-detects `.next`)
   - Install Command: Leave empty (default: `npm install`)
   - Root Directory: `json-parser` (if deploying from monorepo)

3. **Environment Variables** (if needed):
   - None required for basic functionality

4. **Deploy**

## Important Notes

- Do NOT set Output Directory to `public` - Vercel will auto-detect `.next` for Next.js
- The `public` folder is for static assets, not the build output
- Next.js build output goes to `.next` directory

