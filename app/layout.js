import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/components/header/Header';
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import ToastProviderServer from '@/contexts/ToastProviderServer';
import PasskeyRegisterPrompt from '@/components/passkey/PasskeyRegisterPrompt';


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
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "KOR FBB",
  },
};

export default async function RootLayout({ children }) {

  const cookieStore = await cookies();
  const cookie = cookieStore.get('session')?.value
  const session = await decrypt(cookie)

  return (
    <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black z-0`}
        > 
          <ToastProviderServer>
            <Header user={session?.user} />
            {children}
            <PasskeyRegisterPrompt user={session?.user} />
          </ToastProviderServer>
        </body>
    </html>
  );
}