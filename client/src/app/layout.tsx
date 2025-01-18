import type { Metadata } from "next";
import {DM_Sans} from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import {ClerkProvider} from "@clerk/nextjs";
import {Toaster} from "sonner";
import {Suspense} from "react";


const dmSans = DM_Sans({
    subsets: ["latin"],
    display:"swap",
    variable: "--font-dm-sans",
});


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider>
    <html lang="en">
      <body
        className={`${dmSans.className} `}
      >
      <Providers>
          <Suspense fallback={null}>
          <div className='root-layout'>
              {children}
              <Toaster richColors closeButton />
          </div>
          </Suspense>
      </Providers>
      </body>
    </html>
      </ClerkProvider>
  );
}
