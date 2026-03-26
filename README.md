# create-nexa-app

> ⚡ Scaffold a full-stack AI app powered by [NexaAPI](https://rapidapi.com/user/nexaquency) in one command

[![npm version](https://img.shields.io/npm/v/create-nexa-app.svg)](https://www.npmjs.com/package/create-nexa-app)
[![npm downloads](https://img.shields.io/npm/dm/create-nexa-app.svg)](https://www.npmjs.com/package/create-nexa-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Quick Start

```bash
npx create-nexa-app my-ai-app
```

That's it. Follow the prompts to choose your template and API key.

---

## 📦 What You Get

`create-nexa-app` scaffolds a production-ready **Next.js 14** app with:

- ✅ API routes connected to NexaAPI
- ✅ React UI components (ready to use)
- ✅ TypeScript configured
- ✅ `.env.example` with your API key pre-filled
- ✅ `npm run dev` works immediately

---

## 🎨 Templates

| Template | Description | Models |
|----------|-------------|--------|
| `image-gen` | AI Image Generation | FLUX Schnell, FLUX Dev, SDXL |
| `video-gen` | AI Video Generation | Kling 3.0, Veo 3, Sora 2 |
| `tts` | Text-to-Speech | ElevenLabs V3, Gemini TTS |
| `full` | Full AI Suite | All of the above |

---

## 🔑 Get Your API Key

1. Go to 👉 **[rapidapi.com/user/nexaquency](https://rapidapi.com/user/nexaquency)**
2. Subscribe to a plan (free tier available)
3. Copy your `X-RapidAPI-Key`
4. Paste it when prompted by `create-nexa-app`

> **NexaAPI is up to 4x cheaper than OpenAI, fal.ai & Replicate.**

---

## 📖 Usage

### Interactive mode (recommended)

```bash
npx create-nexa-app
```

You'll be asked:
1. Project name
2. Which template to use
3. Your RapidAPI key

### Non-interactive mode

```bash
npx create-nexa-app my-image-app
```

Then follow the prompts.

---

## 🛠️ After Scaffolding

```bash
cd my-ai-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — your AI app is live.

---

## 📁 Project Structure (image-gen template)

```
my-ai-app/
├── app/
│   ├── api/
│   │   └── generate-image/
│   │       └── route.ts      ← API route (calls NexaAPI)
│   ├── components/
│   │   └── ImageGenerator.tsx ← React UI component
│   ├── layout.tsx
│   └── page.tsx
├── .env.example               ← Copy to .env.local
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## 🌐 Links

- 🔑 **Get API Key**: [rapidapi.com/user/nexaquency](https://rapidapi.com/user/nexaquency)
- 📦 **npm**: [npmjs.com/package/create-nexa-app](https://www.npmjs.com/package/create-nexa-app)
- 🐙 **GitHub**: [github.com/diwushennian4955/create-nexa-app](https://github.com/diwushennian4955/create-nexa-app)
- 🌐 **Website**: [nexa-api.com](https://nexa-api.com)

---

## 📄 License

MIT © [NexaAPI](https://nexa-api.com)
