# TrueNorthUGC AI Pipeline

An end-to-end AI video content pipeline for TrueNorthUGC. Enter a brief, get an AI-generated script, pick a talking-head avatar, and produce a finished UGC video — all in one app.

## Features

### 🎬 Video Pipeline (Brief → Script → Avatar → Video)
1. **Brief**: Enter your product, audience, tone, and key message
2. **Script**: GPT-4 generates a camera-ready UGC script (editable)
3. **Avatar**: Browse and select from HeyGen's AI avatar library
4. **Generate**: HeyGen renders a talking-head video with your script
5. **Download**: View and download the finished video

### 💬 Comment Sentiment Analyzer
Paste video comments and get an instant sentiment breakdown (positive/negative/neutral) with audience insights powered by OpenAI.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **AI Script Generation**: OpenAI GPT-4
- **AI Video Generation**: HeyGen API
- **Deployment**: Vercel

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/danieltripyoung1994-cpu/truenortugc-pipeline.git
cd truenortugc-pipeline
npm install
```

### 2. Set Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add:
- `OPENAI_API_KEY` — your OpenAI API key
- `HEYGEN_API_KEY` — your HeyGen API key

### 3. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables: `OPENAI_API_KEY` and `HEYGEN_API_KEY`
4. Deploy 🚀

## License

Private — TrueNorthUGC
