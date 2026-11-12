import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = localFont({
  src: "../../public/fonts/inter/Inter-Variable.ttf",
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = localFont({
  src: "../../public/fonts/jakarta/PlusJakartaSans-Variable.ttf",
  variable: "--font-jakarta",
  display: "swap",
});

const playfairDisplay = localFont({
  src: "../../public/fonts/playfair/PlayfairDisplay-Variable.ttf",
  variable: "--font-playfair",
  display: "swap",
});

const aeonikRegular = localFont({
  src: "../../public/fonts/aeonik/Aeonik-Regular.ttf",
  variable: "--font-aeonik-regular",
  display: "swap",
});

const aeonikMedium = localFont({
  src: "../../public/fonts/aeonik/Aeonik-Medium.ttf",
  variable: "--font-aeonik-medium",
  display: "swap",
});

const aeonikBold = localFont({
  src: "../../public/fonts/aeonik/Aeonik-Bold.ttf",
  variable: "--font-aeonik-bold",
  display: "swap",
});

const aeonikLight = localFont({
  src: "../../public/fonts/aeonik/Aeonik-Light.ttf",
  variable: "--font-aeonik-light",
  display: "swap",
});

const META_LOGO = "/Group-1410097144.svg";

export const metadata = {
  title: {
    default: "Pintree",
    template: "%s | Pintree",
  },
  description:
    "Pintree — a social platform for meaningful connections, communities, and discovery.",
  icons: {
    icon: [{ url: META_LOGO, type: "image/svg+xml" }],
    shortcut: META_LOGO,
    apple: META_LOGO,
  },
  openGraph: {
    type: "website",
    siteName: "Pintree",
    images: [{ url: META_LOGO, alt: "Pintree" }],
  },
  twitter: {
    card: "summary",
    images: [META_LOGO],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`bg-white ${inter.variable} ${plusJakartaSans.variable} ${playfairDisplay.variable} ${aeonikRegular.variable} ${aeonikMedium.variable} ${aeonikBold.variable} ${aeonikLight.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
