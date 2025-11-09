# Deployment Guide for JSON Parser

## Vercel Deployment (Standalone)

This project can be deployed independently on Vercel.

### Option 1: Deploy from Monorepo

1. **Connect your repository** to Vercel
2. **Project Settings:**
   - Framework Preset: **Next.js**
   - Root Directory: **json-parser**
   - Build Command: `npm run build` (or leave empty)
   - Output Directory: **.next** (or leave empty for auto-detect)
   - Install Command: `npm install` (or leave empty)

3. **Deploy**

### Option 2: Deploy as Separate Repository

If you want to deploy this as a separate repository:

1. Copy the `json-parser` folder to a new repository
2. Update any relative paths if needed
3. Deploy normally on Vercel

## Important Notes

- The `vercel.json` file is configured for this project
- Output Directory is `.next` (Next.js default)
- The `public` folder is for static assets only
