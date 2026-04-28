import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NotificationProvider } from "@/components/NotificationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "M. Khafid Bahtiar — Software Engineer",
  description:
    "Explore the professional portfolio of M. Khafid Bahtiar, a Software Engineer dedicated to building high-performance web applications with premium user experiences.",
  keywords: ["Software Engineer", "Web Development", "Portfolio", "M. Khafid Bahtiar", "Fullstack Developer"],
  authors: [{ name: "M. Khafid Bahtiar" }],
  creator: "M. Khafid Bahtiar",
  publisher: "M. Khafid Bahtiar",
  icons: {
    icon: "/image/Logo.png",
    shortcut: "/image/Logo.png",
    apple: "/image/Logo.png",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://mkbahtiar.web.id",
    siteName: "M. Khafid Bahtiar",
    title: "M. Khafid Bahtiar — Software Engineer",
    description: "Digital architect specializing in high-performance web solutions and premium UI/UX design.",
    images: [
      {
        url: "/image/Logo.png",
        width: 1200,
        height: 630,
        alt: "M. Khafid Bahtiar Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "M. Khafid Bahtiar — Software Engineer",
    description: "Software Engineer specializing in modern web technologies.",
    images: ["/image/Logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "M. Khafid Bahtiar",
    "alternateName": "M.K Bahtiar",
    "url": "https://mkbahtiar.web.id",
  };

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "M. Khafid Bahtiar",
    "url": "https://mkbahtiar.web.id",
    "jobTitle": "Software Engineer",
    "sameAs": [
      // Add social links here if available
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
