import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "ProjectForge | Engineering Student Project Sharing & Collaboration Platform",
  description: "A centralized platform for engineering students to discover past projects, share academic work, demonstrate skills, and request peer guidance.",
  keywords: "Engineering Projects, Student Resource Hub, Arduino, ROS 2, Embedded Systems, Machine Learning, CAD Design, Peer Guidance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
