import "./globals.css";
import { Inter, Manrope, Geist } from "next/font/google";
import { DataProvider } from "@/context/dataContext";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
  title: "Nurel Islam Student Management",
  description: "Islamic Excellence Admin Portal",
  manifest: '/manifest.json',
  themeColor: '#166534',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nurel Islam',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Nurel Islam Student Management',
    title: 'Nurel Islam Student Management',
    description: 'Islamic Excellence Admin Portal',
  },
  twitter: {
    card: 'summary',
    title: 'Nurel Islam Student Management',
    description: 'Islamic Excellence Admin Portal',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(inter.variable, manrope.variable, "font-sans", geist.variable)}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      {/* Base classes derived directly from the new HTML files */}
      <body className="bg-background text-on-background font-body-md min-h-screen antialiased">
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}