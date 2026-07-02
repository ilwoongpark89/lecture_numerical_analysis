import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "수치해석 | Numerical Analysis";
const DESC =
  "인하대학교 기계공학과 수치해석 강의. 손으로 못 푸는 방정식을 컴퓨터로 — 이분법·행렬 해법·보간·적분·미분방정식을 한 화면씩.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  openGraph: { title: TITLE, description: DESC, type: "website" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className={`${plusJakarta.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
