import "./globals.css";

export const metadata = {
  title: "BullShift — LinkedIn jargon, decoded",
  description: "Paste a LinkedIn post. Get what they actually meant. No sign-up, no tracking, no circle-backs.",
  metadataBase: new URL("https://www.bullshift.app"),
  openGraph: {
    title: "BullShift",
    description: "LinkedIn jargon — decoded, no mercy.",
    url: "https://www.bullshift.app",
    siteName: "BullShift",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "BullShift — LinkedIn jargon, decoded",
    description: "Paste a LinkedIn post. Get what they actually meant.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
