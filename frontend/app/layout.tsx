import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ProjectForge - Engineering Student Hub & Collaboration Platform",
  description: "A simple, powerful platform for engineering students to share projects, exchange hardware components, and request technical mentorship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="flex flex-col min-h-screen bg-slate-950 text-slate-100 antialiased">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">ProjectForge</span>
              <span>• Engineering Project & Component Exchange Platform</span>
            </div>
            <div>Built with FastAPI, Next.js & SQL</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
