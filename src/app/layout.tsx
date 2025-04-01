import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import Layout from "@/components/Layout";
import '@rainbow-me/rainbowkit/styles.css';
import {Providers} from './providers';
import {Toaster} from "sonner";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "SuperHelper Dapp",
    description: "Dapp for the SuperHelper project, a decentralized application enabling users to create, accept, complete, and rate paid jobs leveraging by the Ethereum blockchain.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
        >
        <Providers>
            <Layout>
                {children}
            </Layout>
        </Providers>
        <Toaster/>
        </body>
        </html>
    );
}
