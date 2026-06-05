import type {Metadata} from 'next';
import './globals.css';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'READZZI',
  description: 'For the Love of Reading',
  icons: {
    icon: '/favicon -.ico',
    shortcut: '/favicon -.ico',
    apple: '/favicon -.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bgSpace = "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2500&auto=format&fit=crop";

  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-body antialiased selection:bg-accent/30 selection:text-white min-h-screen relative" suppressHydrationWarning>
        <div className="fixed inset-0 z-[-1] bg-[#0a0a0c]">
          <Image 
            src={bgSpace} 
            alt="Space Background" 
            fill 
            className="object-cover opacity-40" 
            priority 
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0c]/60 to-[#0a0a0c]" />
        </div>
        
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
