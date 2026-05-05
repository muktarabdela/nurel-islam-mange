import "./globals.css";
import { Inter, Manrope } from "next/font/google";

const inter = Inter({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600"],
  variable: "--font-inter" 
});

const manrope = Manrope({ 
  subsets: ["latin"], 
  weight: ["400", "600", "700"],
  variable: "--font-manrope" 
});

export const metadata = {
  title: "nurel islam student management",
  description: "Islamic Excellence Admin Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* Base classes derived directly from the new HTML files */}
      <body className="bg-background text-on-background font-body-md min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}