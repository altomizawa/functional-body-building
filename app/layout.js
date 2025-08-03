import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/components/header/Header';
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'


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

  const cookieStore = await cookies();
  const cookie = cookieStore.get('session')?.value
  const session = await decrypt(cookie)

  return (
    <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white z-0`}
        > 
          <Header user={session?.user} />
          {children}
        </body>
    </html>
  );
}