'use client';
import { useState } from 'react';

const MODELS = [
  { value: 'flux-schnell', label: 'Flux Schnell (Fast)' },
  { value: 'flux-dev', label: 'Flux Dev (Quality)' },
  { value: 'sdxl', label: 'SDXL (Photorealistic)' },
];

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('flux-schnell');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setImageUrl('');
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setImageUrl(data.images?.[0]?.url || data.url || '');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 16px', fontFamily: 'sans-serif' }}>
      <h1>🎨 AI Image Generator</h1>
      <p style={{ color: '#666' }}>Powered by <a href="https://rapidapi.com/user/nexaquency" target="_blank">NexaAPI</a></p>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Prompt</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="A serene mountain landscape at golden hour..."
          rows={3}
          style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', fontSize: 14 }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Model</label>
        <select
          value={model}
          onChange={e => setModel(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', fontSize: 14 }}
        >
          {MODELS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>

      <button
        onClick={generate}
        disabled={loading || !prompt.trim()}
        style={{
          background: loading ? '#aaa' : '#6c63ff',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '10px 24px',
          fontSize: 15,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 600,
        }}
      >
        {loading ? '⏳ Generating...' : '✨ Generate Image'}
      </button>

      {error && <p style={{ color: 'red', marginTop: 12 }}>❌ {error}</p>}

      {imageUrl && (
        <div style={{ marginTop: 20 }}>
          <img src={imageUrl} alt="Generated" style={{ width: '100%', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
          <a href={imageUrl} download="generated.png" style={{ display: 'inline-block', marginTop: 8, color: '#6c63ff' }}>
            ⬇️ Download
          </a>
        </div>
      )}
    </div>
  );
}
