import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";

import "flowbite";
import PrelineProvider from "./components/PrelineProvider"; // ✅ Import du composant client

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Variable CSS pour utiliser la police
  display: "swap", // Permet un chargement plus fluide
});


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Avelius - Calculateur de ROI",
  description: "Estimé votre ROI généré en externalisant votre prospection",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <head>
        
        <link rel="icon" href="/favicondots.png" type="image/x-icon" /> {/* 🔥 Ajout du favicon */}
      </head>
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <PrelineProvider /> {/* ✅ Charge Preline côté client */}
        <script src="./assets/vendor/nouislider/dist/nouislider.min.js"></script>
      </body>
    </html>
  );
}
