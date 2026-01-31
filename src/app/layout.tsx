import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Republic Motor Works | Multi Brand Car Workshop Patna",
    template: "%s | Republic Motor Works",
  },
  description:
    "Since 1972, Republic Motor Works has been Patna's trusted destination for car detailing, PPF, ceramic coating, wraps, and modifications. Expert care for all vehicles.",
  keywords: [
    "car workshop patna",
    "bike detailing patna",
    "ceramic coating patna",
    "ppf patna",
    "car wrapping patna",
    "vehicle modification patna",
    "republic motor works",
  ],
  authors: [{ name: "Republic Motor Works" }],
  creator: "Republic Motor Works",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://rmwpatna.com",
    siteName: "Republic Motor Works",
    title: "Republic Motor Works | Multi Brand Car Workshop Patna",
    description:
      "Patna's trusted destination for car & bike care since 1972. Detailing, PPF, Ceramic Coating, Wraps & more.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Republic Motor Works",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Republic Motor Works | Multi Brand Car Workshop Patna",
    description:
      "Patna's trusted destination for car & bike care since 1972.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1e3a5f" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
