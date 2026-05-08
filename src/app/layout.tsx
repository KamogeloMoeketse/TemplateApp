import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'TravelForm — Digital Travel Requisitions',
  description: 'Submit and approve travel forms online',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8f9fb] antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
