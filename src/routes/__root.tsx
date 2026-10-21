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
import { SEO } from "@/components/seo/SEO";
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
      { name: "theme-color", content: "#ffffff" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      {
        name: "robots",
        content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      },
      { title: "KhelGrid · Sports Selection Trials, Academies & Quotas" },
      {
        name: "description",
        content:
          "Discover verified sports selection trials across India. Find open trials, SAI NCOE selections, Khelo India academies, and sports quota recruitment drives.",
      },
      {
        name: "keywords",
        content:
          "cricket trials near me, football trials near me, badminton trials near me, athletics trials near me, kabaddi trials near me, wrestling trials near me, selection trials near me, sports trials near me, open selection trials 2026, SAI NCOE trials near me, Khelo India academies near me, sports quota recruitment 2026, CRPF sports quota, boxing trials near me, swimming trials near me, basketball trials near me, turf booking near me, box cricket near me, Sports CV India, grassroots sports India",
      },
      { name: "author", content: "KhelGrid" },
      { property: "og:site_name", content: "KhelGrid" },
      {
        property: "og:title",
        content: "KhelGrid · Sports Selection Trials, Academies & Quotas",
      },
      {
        property: "og:description",
        content:
          "Discover verified sports selection trials across India. Find open trials, SAI NCOE selections, Khelo India academies, and sports quota recruitment drives.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://www.khelgrid.com/og-image.svg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "KhelGrid · Sports Selection Trials, Academies & Quotas" },
      {
        name: "twitter:description",
        content:
          "Discover verified sports selection trials across India. Find open trials, SAI NCOE selections, Khelo India academies, and sports quota recruitment drives.",
      },
      { name: "twitter:site", content: "@khelgrid" },
      { name: "twitter:image", content: "https://www.khelgrid.com/og-image.svg" },
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
      // Canonical Organization, WebSite & BreadcrumbList JSON-LD in main layout
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": ["Organization", "SportsOrganization"],
              "@id": "https://www.khelgrid.com/#organization",
              name: "KhelGrid",
              legalName: "KhelGrid",
              alternateName: [
                "KhelGrid Sports",
                "Khel Grid",
                "KhelGrid Selection Trials",
                "KhelGrid India",
              ],
              url: "https://www.khelgrid.com",
              logo: {
                "@type": "ImageObject",
                url: "https://www.khelgrid.com/favicon-96x96.png",
                width: 96,
                height: 96,
              },
              image: "https://www.khelgrid.com/og-image.svg",
              description:
                "India's premier sports selection trials discovery, grassroots talent scouting, and verified athletic recruitment network. Providing verified listings for selection trials near me, open national and state trials, SAI NCOE trials, Khelo India accredited academies, and government sports quota recruitments across India.",
              slogan: "India's #1 Sports Selection Trials & Opportunity Network",
              areaServed: {
                "@type": "Country",
                name: "India",
              },
              knowsAbout: [
                "Sports Selection Trials",
                "Cricket Trials Near Me",
                "Football Trials Near Me",
                "Badminton Trials Near Me",
                "Athletics Trials Near Me",
                "Kabaddi Trials Near Me",
                "Wrestling Trials Near Me",
                "Swimming Trials Near Me",
                "Shooting Trials Near Me",
                "Basketball Trials Near Me",
                "Boxing Trials Near Me",
                "SAI NCOE Trials",
                "Khelo India Academies",
                "Sports Quota Recruitment 2026",
                "Grassroots Sports in India",
              ],
              sameAs: ["https://twitter.com/khelgrid", "https://www.instagram.com/khelgrid"],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                email: "support@khelgrid.com",
                areaServed: "IN",
                availableLanguage: ["en", "hi"],
              },
            },
            {
              "@type": "WebSite",
              "@id": "https://www.khelgrid.com/#website",
              url: "https://www.khelgrid.com",
              name: "KhelGrid",
              description:
                "Discover open sports selection trials near me, SAI NCOE recruitments, government sports quotas, and verified sports academies across India.",
              publisher: {
                "@id": "https://www.khelgrid.com/#organization",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://www.khelgrid.com/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
              inLanguage: "en-IN",
            },
            {
              "@type": "BreadcrumbList",
              "@id": "https://www.khelgrid.com/#main-breadcrumbs",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://www.khelgrid.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Sports Selection Trials Near Me",
                  item: "https://www.khelgrid.com/search",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Khelo India & SAI Sports Academies",
                  item: "https://www.khelgrid.com/academy",
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: "All Sports Directory",
                  item: "https://www.khelgrid.com/sports",
                },
              ],
            },
          ],
        }),
      },
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
    <html lang="en" className="light" style={{ colorScheme: "light" }} suppressHydrationWarning>
      <head suppressHydrationWarning>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('khelgrid-theme')||localStorage.getItem('theme')||'light';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(!d){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');document.documentElement.style.colorScheme='light';}else{document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}}catch(e){};try{if(typeof window!=='undefined'){window.onerror=function(msg,url){if(msg==='Script error.'||!url||(typeof msg==='string'&&msg.indexOf('Script error')!==-1)){return true;}};window.addEventListener('error',function(e){if(e.message==='Script error.'||(e.filename&&(e.filename.indexOf('googletagmanager')!==-1||e.filename.indexOf('google')!==-1||e.filename.indexOf('doubleclick')!==-1))){if(typeof e.stopImmediatePropagation==='function')e.stopImmediatePropagation();if(typeof e.preventDefault==='function')e.preventDefault();}},true);if(!window.process){window.process={env:{NODE_ENV:'development'}}};window.addEventListener('vite:preloadError',function(){window.location.reload();});}}catch(e){}})()`,
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
        {/* Official Google AdSense script for site ownership verification & ads delivery */}
        {(hasAdSenseEnvId() || adsConfig.publisherId) && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${getEnvPublisherId() || adsConfig.publisherId}`}
            crossOrigin="anonymous"
            suppressHydrationWarning
          />
        )}
        {/* Schema.org Organization structured data directly embedded in initial server-side HTML */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Organization", "SportsOrganization"],
              "@id": "https://www.khelgrid.com/#organization",
              name: "KhelGrid",
              legalName: "KhelGrid",
              alternateName: [
                "KhelGrid Sports",
                "Khel Grid",
                "KhelGrid Selection Trials",
                "KhelGrid India",
              ],
              url: "https://www.khelgrid.com",
              logo: {
                "@type": "ImageObject",
                url: "https://www.khelgrid.com/favicon-96x96.png",
                width: 96,
                height: 96,
              },
              image: "https://www.khelgrid.com/og-image.svg",
              description:
                "India's sports opportunity network connecting grassroots athletes with verified selection trials, Khelo India academies, and sports quota recruitments.",
              sameAs: ["https://twitter.com/khelgrid", "https://www.instagram.com/khelgrid"],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                email: "khelgrid@gmail.com",
                areaServed: "IN",
                availableLanguage: ["en", "hi"],
              },
            }),
          }}
        />
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
                        <SEO
                          title="KhelGrid · Sports Selection Trials, Academies & Quotas"
                          description="Discover verified sports selection trials across India. Find open trials, SAI NCOE selections, Khelo India academies, and sports quota recruitment drives."
                          canonicalUrl="/"
                          keywords="sports trials India, sports opportunities, CRPF recruitment 2026, meritorious sportspersons recruitment, selection trials, book sports turf, cricket trials, football academy combines, athletics trials, badminton selection, sports CV India"
                          formatTitle={false}
                        />
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
