import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { Provider } from '@/providers/Provider';

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
      <Provider session={session} >
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white z-0`}
          > 
          <Header session={session} />
          {children}
        </body>
      </Provider>
    </html>
  );
}