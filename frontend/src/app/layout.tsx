import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { CampaignCapture } from "@/components/providers";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ScrollProgress from "@/components/portal/scroll-progress";
import BackToTop from "@/components/portal/back-to-top";
import SupportWidget from "@/components/portal/support-widget";
import CookieConsent from "@/components/portal/cookie-consent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CivicForce TN | Government of Tamil Nadu — Citizen Action Engine",
    template: "%s | CivicForce TN",
  },
  description:
    "Official citizen grievance and action-tracking portal of the Government of Tamil Nadu. Report non-emergency civic issues, track departmental action and view district resolution performance.",
  applicationName: "CivicForce TN",
  authors: [{ name: "Government of Tamil Nadu" }],
  keywords: [
    "Tamil Nadu",
    "citizen grievance",
    "CivicForce",
    "government portal",
    "civic issues",
    "district administration",
    "GIGW",
    "UX4G",
  ],
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0f2942",
  colorScheme: "light dark",
};

/**
 * Applies stored accessibility and theme preferences before the first paint:
 * high-contrast mode, root text scale, and the resolved light/dark palette.
 * Mirrors `a11y-provider.tsx` and `theme-provider.tsx`.
 * See node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
 */
const PREPAINT_SCRIPT = `(function(){try{var e=document.documentElement;var c=localStorage.getItem("civicforce-a11y-contrast");if(c==="1")e.classList.add("hc");var s=Number(localStorage.getItem("civicforce-a11y-scale"));if(s===0.9||s===1||s===1.15)e.style.setProperty("--a11y-scale",String(s));var t=localStorage.getItem("civicforce-theme");var d=t==="dark"?true:t==="light"?false:!!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d){e.classList.add("dark");e.style.colorScheme="dark";}else{e.style.colorScheme="light";}}catch(x){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <Providers>
          <CampaignCapture />
          <ScrollProgress />
          <SiteHeader />

          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 focus:outline-none"
          >
            <div className="container-gov py-6 sm:py-8">{children}</div>
          </main>

          <SiteFooter />
          <BackToTop />
          <SupportWidget />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
