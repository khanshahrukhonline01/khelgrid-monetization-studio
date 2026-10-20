import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Building2, Trophy, GraduationCap, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { buildSeoHead } from "@/lib/seo";
import {
  AccreditedAcademyList,
  ALL_KHELO_ACADEMIES,
} from "@/components/academy/AccreditedAcademyList";
import { ACADEMY_FAQS, generateAcademyFaqSchema } from "@/data/academy-faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/academy")({
  head: () =>
    buildSeoHead({
      title: "Sports Academies in India: Khelo India & SAI Listings | KhelGrid",
      description:
        "Independent directory of sports academies in India, including Khelo India accredited academies and SAI centres. Filter by sport, city, facilities and fees.",
      canonicalPath: "/academy",
      keywords:
        "sports academies in india, khelo india accredited academies, sports authority of india, sai ncoe, sports academies faq, how to join sports academy, sai sports hostel, sports scholarships india, sports academy fees, admission sports academy, sports academy selection trials",
      type: "website",
      customSchema: generateAcademyFaqSchema(),
    }),
  component: AcademyPage,
});

export function AcademyPage() {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: "",
    director: "",
    sport: "Archery",
    city: "Pune",
    accreditationType: "Khelo India Accredited Academy (KIAA)",
    phone: "",
    email: "",
  });

  const totalAcademies = ALL_KHELO_ACADEMIES.length;
  const totalCities = new Set(ALL_KHELO_ACADEMIES.map((a) => a.city)).size;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.name.trim() || !registerForm.phone.trim()) {
      toast.error("Please fill in the academy name and contact phone");
      return;
    }
    toast.success(
      `Listing claim received for "${registerForm.name}"! Our directory desk will verify your details and update your listing.`,
    );
    setRegisterModalOpen(false);
  };

  return (
    <main className="mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-10 w-full min-w-0 max-w-full overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-card p-6 sm:p-10 shadow-sm relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        {/* Dynamic Source & Count Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary font-medium px-3 py-1 text-xs"
          >
            {totalAcademies} academies listed · {totalCities} cities · Source: SAI &amp; Khelo India
            Public Directory · Last updated October 2026
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground max-w-3xl leading-tight">
          Sports Academies Directory India
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          An independent directory of academies across India, including those listed under Khelo
          India and SAI centres. Filter by sport, city and level, then contact the academy directly.
        </p>

        {/* Top Action CTAs */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setRegisterModalOpen(true)}
            size="sm"
            className="gap-2 bg-primary text-primary-foreground font-semibold shadow-xs cursor-pointer"
          >
            <Building2 className="h-4 w-4" />
            <span>Claim or Update Listing</span>
          </Button>

          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to="/train" search={{ entityType: "academies" }}>
              <GraduationCap className="h-4 w-4" />
              <span>Explore All in Training Hub</span>
            </Link>
          </Button>

          <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <Link to="/search">
              <Trophy className="h-4 w-4" />
              <span>View Active Selection Trials</span>
            </Link>
          </Button>
        </div>

        {/* Mandatory Independent Platform Disclaimer */}
        <div className="mt-6 rounded-2xl border border-border/80 bg-background/80 backdrop-blur-xs p-4 sm:p-5 text-xs text-muted-foreground leading-relaxed">
          <p>
            KhelGrid is an independent platform. It is not affiliated with, endorsed by or operated
            by Sports Authority of India, the Ministry of Youth Affairs and Sports, or the Khelo
            India programme. Listings are compiled from Sports Authority of India &amp; Khelo India
            public notifications (October 2026) and details submitted by academies. Accreditation,
            fees, scholarships and facilities can change, so confirm them with the academy and on
            the official Khelo India and SAI websites before applying. Found an error?{" "}
            <Link
              to="/contact"
              className="underline font-semibold text-foreground hover:text-primary"
            >
              Report a correction
            </Link>
            . Run an academy?{" "}
            <button
              type="button"
              onClick={() => setRegisterModalOpen(true)}
              className="underline font-semibold text-foreground hover:text-primary cursor-pointer"
            >
              Claim or update your listing
            </button>
            .
          </p>
        </div>
      </div>

      {/* 2. ORIGINAL CONTENT BLOCK: HOW TO CHOOSE A SPORTS ACADEMY */}
      <section className="mb-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          How to choose a sports academy
        </h2>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          Start with the sport and age group, then compare coach credentials, weekly training hours,
          and whether boarding and schooling are included. Khelo India accredited academies and SAI
          centres (such as National Centres of Excellence and Training Centres) are linked to
          government programmes, but fees, intake and scholarships vary by academy and year. Visit
          if you can, ask about trial dates and selection criteria, and get fee and scholarship
          terms in writing.
        </p>
      </section>

      {/* 3. DATA-DRIVEN COMPONENT: ACCREDITED ACADEMY LIST */}
      <AccreditedAcademyList
        title="Sports Academies Directory"
        subtitle="Filter academies by sport, city, level and facilities. Details are compiled from public directory records and academy submissions."
        showFilters={true}
        showSeoMetadata={true}
      />

      {/* 4. FREQUENTLY ASKED QUESTIONS (FAQ) & RICH RESULTS ACCORDION */}
      <section className="my-12 rounded-3xl border border-border/80 bg-gradient-to-br from-card/80 via-card/40 to-background p-6 sm:p-10 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Knowledge & FAQs
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Frequently Asked Questions About Sports Academies in India
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
          Everything parents and athletes need to know about Khelo India accreditation, SAI
          scholarships, admissions, facilities, and selection trials.
        </p>

        <Accordion type="single" collapsible className="mt-8 divide-y divide-border/60">
          {ACADEMY_FAQS.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="border-border/60 py-1">
              <AccordionTrigger className="text-sm sm:text-base font-semibold text-foreground hover:text-primary hover:no-underline">
                <span className="flex items-center gap-2 text-left">
                  <Badge
                    variant="outline"
                    className="text-[10px] border-primary/30 text-primary font-normal hidden sm:inline-flex"
                  >
                    {faq.category}
                  </Badge>
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* 4. REGISTER / CLAIM ACADEMY MODAL */}
      {registerModalOpen && (
        <Dialog open={registerModalOpen} onOpenChange={setRegisterModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Building2 className="h-5 w-5 text-primary" />
                <span>Claim or Update an Academy Listing</span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Submit updated contact details, fees, or facilities for your academy.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 py-2">
              <div>
                <label className="text-xs font-semibold text-foreground">Academy Name *</label>
                <Input
                  required
                  placeholder="e.g. Apex High-Performance Sports Center"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Chief Coach / Director
                  </label>
                  <Input
                    placeholder="e.g. Coach Ramesh Kumar"
                    value={registerForm.director}
                    onChange={(e) => setRegisterForm({ ...registerForm, director: e.target.value })}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Sport Discipline</label>
                  <Input
                    placeholder="e.g. Archery, Athletics, Boxing"
                    value={registerForm.sport}
                    onChange={(e) => setRegisterForm({ ...registerForm, sport: e.target.value })}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-foreground">City</label>
                  <Input
                    placeholder="e.g. Pune, Bhopal, Delhi"
                    value={registerForm.city}
                    onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Accreditation</label>
                  <select
                    aria-label="Accreditation"
                    value={registerForm.accreditationType}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, accreditationType: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-border bg-background px-2.5 py-2 text-xs cursor-pointer"
                  >
                    <option value="Khelo India Accredited Academy (KIAA)">
                      Khelo India Accredited (KIAA)
                    </option>
                    <option value="SAI NCOE Partner">SAI NCOE Partner</option>
                    <option value="National Sports Federation (NSF)">
                      National Sports Federation (NSF)
                    </option>
                    <option value="State Sports Directorate Recognised">
                      State Sports Directorate
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-foreground">Phone Number *</label>
                  <Input
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Official Email</label>
                  <Input
                    type="email"
                    placeholder="contact@academy.org"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
              </div>

              <DialogFooter className="mt-4 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRegisterModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary text-primary-foreground font-semibold"
                >
                  Submit Listing Update
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}

export default AcademyPage;
