# ShelbyShare - Starter Template

Complete Next.js starter for building Shelby decentralized file sharing app.

## 🚀 Quick Start

```bash
# 1. Clone this repo
git clone <your-repo>
cd shelbyshare

# 2. Install dependencies  
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Setup database (see below)

# 5. Run development server
npm run dev
```

Open http://localhost:3000

## 📦 What's Included

### ✅ Complete Setup:
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Supabase integration
- File upload/download

### ✅ Key Features:
- Drag & drop file upload
- Shareable links
- Auto-expiration
- Network stats
- Mobile responsive

### ✅ Components:
- FileUploader (drag & drop)
- ShareLink (copy to clipboard)
- DownloadButton
- StatsCard

## 🗄️ Database Setup

### 1. Create Supabase Project

Go to https://supabase.com and create a new project.

### 2. Run SQL

In Supabase SQL Editor, run:

```sql
CREATE TABLE uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id VARCHAR(12) UNIQUE NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  shelby_path VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100),
  password_hash VARCHAR(255),
  expires_at TIMESTAMP NOT NULL,
  download_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  ip_address VARCHAR(45),
  INDEX idx_share_id (share_id),
  INDEX idx_expires_at (expires_at)
);

CREATE TABLE stats (
  id SERIAL PRIMARY KEY,
  total_uploads BIGINT DEFAULT 0,
  total_downloads BIGINT DEFAULT 0,
  total_bytes BIGINT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO stats (total_uploads, total_downloads, total_bytes) 
VALUES (0, 0, 0);
```

### 3. Get API Keys

Copy from Supabase Settings → API:
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
- service_role key → `SUPABASE_SERVICE_KEY`

Add to `.env.local`

## 🔧 Shelby Setup

### Install Shelby CLI

```bash
npm install -g @shelby-protocol/cli
```

### Initialize

```bash
shelby init
# Press Enter for all prompts (use defaults)
```

### Fund Account

1. Get your address:
```bash
shelby account list
```

2. Visit faucet: https://faucet.shelbynet.shelby.xyz

3. Fund both APT and ShelbyUSD

4. Verify:
```bash
shelby account balance
```

## 📁 Project Structure

```
shelbyshare/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Global styles
│   ├── d/[shareId]/        # Download pages
│   │   └── page.tsx
│   └── api/
│       ├── upload/         # Upload endpoint
│       │   └── route.ts
│       └── download/       # Download endpoint
│           └── [id]/
│               └── route.ts
├── components/
│   ├── FileUploader.tsx
│   ├── ShareLink.tsx
│   └── DownloadButton.tsx
├── lib/
│   ├── shelby.ts          # Shelby integration
│   ├── supabase.ts        # Database client
│   └── utils.ts
└── public/
```

## 🎨 Customization

### Change Branding

Edit `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: "YourApp - Description",
  description: "Your description",
};
```

### Change Colors

Edit `tailwind.config.ts` - update color scheme

### Add Features

See `TODO.md` for feature ideas:
- Password protection
- Wallet connect
- File previews
- Analytics

## 🚀 Deployment

### Deploy to Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Add environment variables in Vercel dashboard
```

### Environment Variables in Vercel

Add these in Vercel project settings:
- `NEXT_PUBLIC_URL` → your-app.vercel.app
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`

## ⚠️ Current Limitations

### Upload Method:
Currently uses Shelby CLI for uploads (backend). Browser wallet signing not yet supported by SDK.

**Workaround:** Files are uploaded server-side via API route that calls Shelby CLI.

### File Size:
Max 100MB per file (Next.js limit).

**Future:** Implement chunking for larger files.

### Expiration:
Fixed 7 days expiration.

**Future:** Let users choose (1hr, 1day, 7days, 30days).

## 🐛 Troubleshooting

### "Shelby command not found"
```bash
npm install -g @shelby-protocol/cli
```

### "Upload failed"
Check Shelby balance:
```bash
shelby account balance
```
Need both APT and ShelbyUSD tokens.

### "Database error"
Verify Supabase credentials in `.env.local`

### "Build error"
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## 📝 TODO

See `TODO.md` for planned features and improvements.

## 🤝 Contributing

This is a starter template for Shelby Early Access application.
Feel free to fork and customize!

## 📄 License

MIT

## 🔗 Links

- Shelby Docs: https://docs.shelby.xyz
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

---

Built for Shelby Early Access Application 🚀
