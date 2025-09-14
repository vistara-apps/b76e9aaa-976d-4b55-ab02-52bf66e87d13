import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Civic Ballot',
  description: 'Your secure, real-time platform for community voting and polling.',
  openGraph: {
    title: 'Civic Ballot',
    description: 'Your secure, real-time platform for community voting and polling.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
