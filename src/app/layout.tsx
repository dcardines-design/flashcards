import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Flashcards',
  description: 'AI-powered flashcard study app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0b] min-h-screen text-white flex flex-col`}>
        <main className="sm:max-w-lg mx-auto px-4 py-6 pb-24 flex-1 w-full">
          {children}
        </main>
        <footer className="text-center py-4 text-zinc-600 text-sm">
          Made for Simone, study well
        </footer>
      </body>
    </html>
  );
}
