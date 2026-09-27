import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { Toaster } from "sonner";
import AuthListener from "@/components/providers/AuthListener";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { StoreProvider } from "@/store/StoreProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Nivora — Work, in sync.",
  description:
    "The calm, focused workspace for ambitious teams building what matters next.",
};

// Applies the stored theme to <html> before React hydrates, so there's
// no flash of the wrong theme on load. Runs as a plain inline script
// since it must execute before paint, ahead of any React code.
const themeInitScript = `
(function () {
  try {
    var stored = window.localStorage.getItem("nivora-theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = stored || (prefersDark ? "dark" : "light");
    if (theme === "dark") document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <ThemeProvider>
            <AuthListener />
            {children}
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}