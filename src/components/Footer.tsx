import { Link } from "@tanstack/react-router";
import { PRIMARY_ITEMS, FEATURE_ITEMS } from "@/config/nav";
import { Facebook, Twitter, Instagram, Linkedin, MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import { TrialNewsletterSignup } from "@/components/TrialNewsletterSignup";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Newsletter Signup for Automatic Trial Notifications */}
        <div className="mb-12">
          <TrialNewsletterSignup
            title="Get Automatic Notifications Whenever a Sports Trial is Posted"
            subtitle="Subscribe to free email alerts tailored to your sport and state. Be the first to apply to official trials, academy scoutings, and SAI selection camps."
          />
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fbb0e1ceb11294a31a719df6ba93a7331%2Fc8513d4ae3bd4939b4defe6841f88dd7?format=webp&width=800&height=1200"
                alt="KhelGrid"
                width={32}
                height={32}
                loading="lazy"
                decoding="async"
                className="h-8 w-8"
              />
              <span className="text-lg font-bold">
                Khel<span className="text-primary">Grid</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              India's sports trials, scouted & monetized. Find opportunities, build your career.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.reddit.com/r/Khelgridonline/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join KhelGrid on Reddit"
                title="KhelGrid on Reddit"
                className="text-muted-foreground hover:text-primary transition"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
            <a
              href="https://www.reddit.com/r/Khelgridonline/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit the KhelGrid Reddit community"
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:border-primary/50 hover:text-primary"
            >
              <MessageCircle className="h-4 w-4 text-primary" />
              Join our Reddit community
            </a>
          </div>
          </div>

          {/* Primary Navigation */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Main</h4>
            <ul className="space-y-2">
              {PRIMARY_ITEMS.slice(0, 6).map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-muted-foreground hover:text-primary transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Features</h4>
            <ul className="space-y-2">
              {FEATURE_ITEMS.slice(0, 6).map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-muted-foreground hover:text-primary transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Features */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Explore</h4>
            <ul className="space-y-2">
              {FEATURE_ITEMS.slice(6, 12).map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-muted-foreground hover:text-primary transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex gap-2 text-sm">
                  <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <a
                    href="mailto:support@khelgrid.com"
                    className="text-muted-foreground hover:text-primary transition"
                  >
                    support@khelgrid.com
                  </a>
                </li>
                <li className="flex gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <a
                    href="tel:+919876543210"
                    className="text-muted-foreground hover:text-primary transition"
                  >
                    +91 98765 43210
                  </a>
                </li>
                <li className="flex gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Mumbai, India</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal & Trust</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/privacy"
                    className="text-sm text-muted-foreground hover:text-primary transition"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-sm text-muted-foreground hover:text-primary transition"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cancellation-policy"
                    className="text-sm text-muted-foreground hover:text-primary transition"
                  >
                    Cancellation Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/posh-policy"
                    className="text-sm text-muted-foreground hover:text-primary transition"
                  >
                    POSH Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/trust-center"
                    className="text-sm text-muted-foreground hover:text-primary transition"
                  >
                    Trust Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="text-sm text-muted-foreground hover:text-primary transition"
                  >
                    Settings
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40 my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {currentYear} KhelGrid. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 sm:mt-0">
            <Link to="/privacy" className="hover:text-primary transition">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-primary transition">
              Terms
            </Link>
            <Link to="/ipr-policy" className="hover:text-primary transition">
              IPR & Copyright
            </Link>
            <Link to="/cancellation-policy" className="hover:text-primary transition">
              Cancellation
            </Link>
            <Link to="/posh-policy" className="hover:text-primary transition">
              POSH Policy
            </Link>
            <Link to="/settings" className="hover:text-primary transition">
              Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
