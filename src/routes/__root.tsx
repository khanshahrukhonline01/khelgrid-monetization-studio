import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/context/AuthContext";
import { BlogProvider } from "@/context/BlogContext";
import { FollowedAcademyProvider } from "@/context/FollowedAcademyContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { SavedOpportunityProvider } from "@/context/SavedOpportunityContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { HelmetProvider } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BottomTabBar } from "@/components/BottomTabBar";
import { Toaster } from "@/components/ui/sonner";
import {
  AdConsentProvider,
  AdConsentBanner,
  AdSenseLoader,
  StickyMobileAdSlot,
} from "@/components/ads";
import { adsConfig, hasValidPublisherId, hasAdSenseEnvId, getEnvPublisherId } from "@/config/ads";
import { analyticsConfig } from "@/config/analytics";
import { GoogleTagLoader } from "@/components/GoogleTagLoader";
import { SEOHead } from "@/components/SEOHead";
import { SiteFooter } from "@/components/SiteFooter";
import { FeaturesSidebar } from "@/components/FeaturesSidebar";
import { HydrationDiagnostics } from "@/components/HydrationDiagnostics";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This trial doesn't exist on the grid.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try again.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0a0a0a" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      {
        name: "robots",
        content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      },
      { title: "KhelGrid · India's Sports Opportunity Network" },
      {
        name: "description",
        content:
          "India's premier sports platform for discovery and development. Find sports selection trials, government recruitments (CRPF 2026), turf venues, coaching academies, and athlete CVs.",
      },
      {
        name: "keywords",
        content:
          "sports trials India, sports opportunities, CRPF recruitment 2026, meritorious sportspersons recruitment, selection trials, book sports turf, cricket trials, football academy combines, athletics trials, badminton selection, sports CV India",
      },
      { name: "author", content: "KhelGrid" },
      { property: "og:site_name", content: "KhelGrid" },
      { property: "og:title", content: "KhelGrid · India's Sports Opportunity Network" },
      {
        property: "og:description",
        content:
          "India's premier sports platform for discovery and development. Find sports selection trials, government recruitments (CRPF 2026), turf venues, coaching academies, and athlete CVs.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://khelgrid.com/og-image.svg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@khelgrid" },
      { name: "twitter:image", content: "https://khelgrid.com/og-image.svg" },
      // AdSense site ownership verification
      {
        name: "google-adsense-account",
        content: adsConfig.publisherId || "ca-pub-8352691151177209",
      },
    ],
    links: [
      // Brand Favicons & Icons for browser tabs and mobile home screens
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },

      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://www.googletagmanager.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap",
      },

      { rel: "stylesheet", href: appCss },
      // Ads: warm up Google's ad hosts so the first unit paints faster.
      ...(hasValidPublisherId()
        ? ([
            {
              rel: "preconnect",
              href: "https://pagead2.googlesyndication.com",
              crossOrigin: "anonymous",
            },
            { rel: "dns-prefetch", href: "https://googleads.g.doubleclick.net" },
            { rel: "dns-prefetch", href: "https://tpc.googlesyndication.com" },
          ] as const)
        : []),
    ],
    scripts: [
      ...(!import.meta.env.DEV && hasValidPublisherId()
        ? [
            {
              src: `https://fundingchoicesmessages.google.com/i/${adsConfig.publisherId}?ers=1`,
              async: true,
              crossOrigin: "anonymous" as const,
            },
          ]
        : []),
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const gaMeasurementId =
    ((import.meta.env["VITE_GA_MEASUREMENT_ID"] as string | undefined) ?? "").trim() ||
    analyticsConfig.measurementId ||
    "G-BETWHB02PX";

  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <head suppressHydrationWarning>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('khelgrid-theme')||localStorage.getItem('theme')||'dark';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(!d){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');document.documentElement.style.colorScheme='light';}else{document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}}catch(e){};try{if(typeof window!=='undefined'){window.onerror=function(msg,url){if(msg==='Script error.'||!url||(typeof msg==='string'&&msg.indexOf('Script error')!==-1)){return true;}};window.addEventListener('error',function(e){if(e.message==='Script error.'||(e.filename&&(e.filename.indexOf('googletagmanager')!==-1||e.filename.indexOf('google')!==-1||e.filename.indexOf('doubleclick')!==-1))){if(typeof e.stopImmediatePropagation==='function')e.stopImmediatePropagation();if(typeof e.preventDefault==='function')e.preventDefault();}},true);if(!window.process){window.process={env:{NODE_ENV:'development'}}};window.addEventListener('vite:preloadError',function(){window.location.reload();});}}catch(e){}})()`,
          }}
        />
        {/* Official Google Tag (gtag.js) for GA4 measurement - G-BETWHB02PX only */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
          crossOrigin="anonymous"
          suppressHydrationWarning
        />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaMeasurementId}',{send_page_view:true});`,
          }}
        />
        {/* Official Google AdSense script for site ownership verification & ads delivery (only loaded when VITE_GOOGLE_ADSENSE_ID is present) */}
        {hasAdSenseEnvId() && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${getEnvPublisherId()}`}
            crossOrigin="anonymous"
            suppressHydrationWarning
          />
        )}
        <HeadContent />
      </head>
      <body className="overflow-x-hidden" suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ThemedToaster() {
  const { resolvedTheme, mounted } = useTheme();
  return <Toaster theme={mounted ? resolvedTheme : "dark"} position="top-right" />;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <BlogProvider>
                <SavedOpportunityProvider>
                  <FollowedAcademyProvider>
                    <NotificationProvider>
                      <AdConsentProvider requireConsent={false}>
                        <GoogleTagLoader />
                        <SEOHead />
                        <AdSenseLoader />

                        <Navbar />
                        <Breadcrumbs />
                        <div className="block lg:flex min-h-[calc(100vh-4rem)] w-full min-w-0 max-w-full">
                          <FeaturesSidebar />
                          <div className="flex min-w-0 max-w-full flex-1 flex-col pb-28 lg:pb-0">
                            <main className="flex-1 min-w-0 max-w-full">
                              <Outlet />
                            </main>
                            <SiteFooter />
                          </div>
                        </div>
                        <BottomTabBar />

                        <StickyMobileAdSlot />
                        <AdConsentBanner />
                        <ThemedToaster />
                        <HydrationDiagnostics />
                      </AdConsentProvider>
                    </NotificationProvider>
                  </FollowedAcademyProvider>
                </SavedOpportunityProvider>
              </BlogProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
