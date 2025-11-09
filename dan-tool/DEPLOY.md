# Deployment Guide for Dan Tool

## Vercel Deployment (Standalone)

This project can be deployed independently on Vercel.

### Option 1: Deploy from Monorepo

1. **Connect your repository** to Vercel
2. **Project Settings:**
   - Framework Preset: **Next.js**
   - Root Directory: **dan-tool**
   - Build Command: `npm run build` (or leave empty)
   - Output Directory: **.next** (or leave empty for auto-detect)
   - Install Command: `npm install` (or leave empty)

3. **Environment Variables** (optional):
   - `NEXT_PUBLIC_AUTO_REQUEST_SENDER_URL` - URL for Auto Request Sender
   - `NEXT_PUBLIC_AUTO_REQUEST_SENDER_GITHUB` - GitHub URL for Auto Request Sender
   - `NEXT_PUBLIC_JSON_PARSER_URL` - URL for JSON Parser
   - `NEXT_PUBLIC_JSON_PARSER_GITHUB` - GitHub URL for JSON Parser

4. **Deploy**

### Option 2: Deploy as Separate Repository

If you want to deploy this as a separate repository:

1. Copy the `dan-tool` folder to a new repository
2. Update any relative paths if needed
3. Deploy normally on Vercel

## Important Notes

- No `vercel.json` needed - Vercel auto-detects Next.js
- Output Directory is `.next` (Next.js default)
- The `public` folder is for static assets only
- Each tool (json-parser, dan-tool) can be deployed separately
