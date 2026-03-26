/**
 * Programmatic project generator (fallback when template dirs are empty)
 */

const fs = require('fs');
const path = require('path');

async function generate({ name, template, targetDir, apiKey }) {
  // Create base structure
  const dirs = [
    'app/api',
    'app/components',
  ];

  for (const dir of dirs) {
    fs.mkdirSync(path.join(targetDir, dir), { recursive: true });
  }

  // Write package.json
  const pkg = {
    name,
    version: '0.1.0',
    private: true,
    scripts: { dev: 'next dev', build: 'next build', start: 'next start' },
    dependencies: { next: '14.2.0', react: '^18', 'react-dom': '^18' },
    devDependencies: { typescript: '^5', '@types/node': '^20', '@types/react': '^18', '@types/react-dom': '^18' },
  };
  fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkg, null, 2));

  // Write .env.local
  fs.writeFileSync(path.join(targetDir, '.env.local'), `RAPIDAPI_KEY=${apiKey}\n`);
  fs.writeFileSync(path.join(targetDir, '.env.example'), `RAPIDAPI_KEY=YOUR_RAPIDAPI_KEY\n`);

  // Write next.config.js
  fs.writeFileSync(path.join(targetDir, 'next.config.js'), `/** @type {import('next').NextConfig} */\nmodule.exports = {};\n`);

  // Write tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: 'es5', lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true, skipLibCheck: true, strict: true, noEmit: true,
      esModuleInterop: true, module: 'esnext', moduleResolution: 'bundler',
      resolveJsonModule: true, isolatedModules: true, jsx: 'preserve', incremental: true,
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'],
    exclude: ['node_modules'],
  };
  fs.writeFileSync(path.join(targetDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

  // Write layout
  fs.writeFileSync(path.join(targetDir, 'app/layout.tsx'), `export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}\n`);

  // Template-specific files
  if (template === 'image-gen' || template === 'full') {
    fs.mkdirSync(path.join(targetDir, 'app/api/generate-image'), { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'app/api/generate-image/route.ts'), getImageRoute());
    fs.writeFileSync(path.join(targetDir, 'app/components/ImageGenerator.tsx'), getImageComponent());
  }

  if (template === 'video-gen' || template === 'full') {
    fs.mkdirSync(path.join(targetDir, 'app/api/generate-video'), { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'app/api/generate-video/route.ts'), getVideoRoute());
    fs.writeFileSync(path.join(targetDir, 'app/components/VideoGenerator.tsx'), getVideoComponent());
  }

  if (template === 'tts' || template === 'full') {
    fs.mkdirSync(path.join(targetDir, 'app/api/text-to-speech'), { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'app/api/text-to-speech/route.ts'), getTTSRoute());
    fs.writeFileSync(path.join(targetDir, 'app/components/TextToSpeech.tsx'), getTTSComponent());
  }

  // Write page.tsx
  const imports = [];
  const components = [];
  if (template === 'image-gen' || template === 'full') { imports.push("import ImageGenerator from './components/ImageGenerator';"); components.push('<ImageGenerator />'); }
  if (template === 'video-gen' || template === 'full') { imports.push("import VideoGenerator from './components/VideoGenerator';"); components.push('<VideoGenerator />'); }
  if (template === 'tts' || template === 'full') { imports.push("import TextToSpeech from './components/TextToSpeech';"); components.push('<TextToSpeech />'); }

  fs.writeFileSync(path.join(targetDir, 'app/page.tsx'), `${imports.join('\n')}\nexport default function Home() {\n  return <main>${components.join('\n      ')}</main>;\n}\n`);
}

function getImageRoute() {
  return `import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const { prompt, model = 'flux-schnell', width = 1024, height = 1024 } = await req.json();
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) return NextResponse.json({ error: 'RAPIDAPI_KEY not set' }, { status: 500 });
  const res = await fetch('https://nexa-api-image.p.rapidapi.com/v1/images/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': 'nexa-api-image.p.rapidapi.com' },
    body: JSON.stringify({ prompt, model, width, height, num_images: 1 }),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}\n`;
}

function getVideoRoute() {
  return `import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const { prompt, model = 'kling-v3' } = await req.json();
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) return NextResponse.json({ error: 'RAPIDAPI_KEY not set' }, { status: 500 });
  const res = await fetch('https://nexa-api-video.p.rapidapi.com/v1/videos/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': 'nexa-api-video.p.rapidapi.com' },
    body: JSON.stringify({ prompt, model }),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}\n`;
}

function getTTSRoute() {
  return `import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const { text, voice = 'alloy' } = await req.json();
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) return NextResponse.json({ error: 'RAPIDAPI_KEY not set' }, { status: 500 });
  const res = await fetch('https://nexa-api-tts.p.rapidapi.com/v1/audio/speech', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': 'nexa-api-tts.p.rapidapi.com' },
    body: JSON.stringify({ text, voice }),
  });
  const audioBuffer = await res.arrayBuffer();
  return new NextResponse(audioBuffer, { headers: { 'Content-Type': 'audio/mpeg' } });
}\n`;
}

function getImageComponent() {
  return `'use client';
import { useState } from 'react';
export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const generate = async () => {
    setLoading(true);
    const res = await fetch('/api/generate-image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
    const data = await res.json();
    setUrl(data.images?.[0]?.url || data.url || '');
    setLoading(false);
  };
  return (
    <div style={{ padding: 20 }}>
      <h2>🎨 Image Generator</h2>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your image..." rows={3} style={{ width: '100%', marginBottom: 8 }} />
      <button onClick={generate} disabled={loading}>{loading ? 'Generating...' : 'Generate'}</button>
      {url && <img src={url} alt="Generated" style={{ marginTop: 16, maxWidth: '100%' }} />}
    </div>
  );
}\n`;
}

function getVideoComponent() {
  return `'use client';
import { useState } from 'react';
export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const generate = async () => {
    setLoading(true);
    const res = await fetch('/api/generate-video', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
    const data = await res.json();
    setVideoUrl(data.video_url || data.url || '');
    setLoading(false);
  };
  return (
    <div style={{ padding: 20 }}>
      <h2>🎬 Video Generator</h2>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your video..." rows={3} style={{ width: '100%', marginBottom: 8 }} />
      <button onClick={generate} disabled={loading}>{loading ? 'Generating...' : 'Generate Video'}</button>
      {videoUrl && <video src={videoUrl} controls style={{ marginTop: 16, maxWidth: '100%' }} />}
    </div>
  );
}\n`;
}

function getTTSComponent() {
  return `'use client';
import { useState } from 'react';
export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const speak = async () => {
    setLoading(true);
    const res = await fetch('/api/text-to-speech', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
    const blob = await res.blob();
    setAudioUrl(URL.createObjectURL(blob));
    setLoading(false);
  };
  return (
    <div style={{ padding: 20 }}>
      <h2>🔊 Text to Speech</h2>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter text to speak..." rows={3} style={{ width: '100%', marginBottom: 8 }} />
      <button onClick={speak} disabled={loading}>{loading ? 'Converting...' : 'Convert to Speech'}</button>
      {audioUrl && <audio src={audioUrl} controls style={{ marginTop: 16, display: 'block' }} />}
    </div>
  );
}\n`;
}

module.exports = { generate };
