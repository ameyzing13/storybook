import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { createClient } from '@/utils/supabase/server';
import { LandingPageHeader } from '@/components/landing-page-header';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "AI Life Coach Journal - Personal Growth Through AI-Guided Journaling",
  description: "Transform your life with personalized AI coaching, therapy, and guided journaling for personal growth and self-discovery.",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">
            {/* Only show landing page header when not authenticated */}
            
            {children}

            {/* Footer */}
            <footer className="w-full border-t py-8 bg-white dark:bg-gray-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">JourneyAI</h3>
                    <p className="text-sm text-muted-foreground">
                      Your personal AI life coach for growth and self-discovery.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-4">Links</h4>
                    <div className="space-y-3">
                      <Link href="/privacy" className="block text-sm text-muted-foreground hover:text-foreground">
                        Privacy Policy
                      </Link>
                      <Link href="/terms" className="block text-sm text-muted-foreground hover:text-foreground">
                        Terms of Service
                      </Link>
                      <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground">
                        Contact Us
                      </Link>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Made with ❤️</p>
                  </div>
                </div>
              </div>
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
