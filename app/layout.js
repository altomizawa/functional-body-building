import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LogoutButton from '@/components/LogoutButton';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "KOR Functional Bodybuilding",
  description: "KOR Functional Bodybuilding",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-300`}
      >
        {children}
        <div className='absolute top-4 right-4'>
          <LogoutButton />
        </div>
      </body>
    </html>
  );
}
