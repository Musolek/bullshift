import "./globals.css";

export const metadata = {
  title: "BullShift — LinkedIn Jargon Decoder | Translate Corporate Speak",
  description: "Decode LinkedIn corporate jargon instantly. Paste any corporate communication and get the real meaning. No sign-up, no tracking, no circle-backs. Free AI-powered translation tool.",
  keywords: "LinkedIn jargon decoder, corporate speak translator, buzzword translator, corporate bullshit detector, LinkedIn post decoder, corporate communication analyzer",
  metadataBase: new URL("https://www.bullshift.app"),
  openGraph: {
    title: "BullShift — LinkedIn Jargon Decoder",
    description: "Decode LinkedIn corporate jargon instantly. Paste any corporate communication and get the real meaning.",
    url: "https://www.bullshift.app",
    siteName: "BullShift",
    type: "website",
    images: [
      {
        url: "https://www.bullshift.app/logo.png",
        width: 1200,
        height: 630,
        alt: "BullShift - LinkedIn Jargon Decoder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BullShift — LinkedIn Jargon Decoder",
    description: "Decode LinkedIn corporate jargon instantly. Paste any corporate communication and get the real meaning.",
    images: ["https://www.bullshift.app/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500;1,600;1,700;0,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "BullShift",
              description: "Decode LinkedIn corporate jargon instantly. Paste any corporate communication and get the real meaning.",
              url: "https://www.bullshift.app",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Organization",
                name: "BullShift",
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
