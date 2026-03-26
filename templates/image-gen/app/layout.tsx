import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '{{PROJECT_NAME}} — AI Image Generator',
  description: 'AI Image Generator powered by NexaAPI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
