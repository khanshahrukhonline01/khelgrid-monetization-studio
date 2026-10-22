import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
  Trophy,
  ArrowRight,
  Shield,
  HeartHandshake,
} from "lucide-react";
import { buildSeoHead } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/careers")({
  head: () =>
    buildSeoHead({
      title: "Careers at KhelGrid · Build India's Sports Intelligence & Discovery Network",
      description:
        "Join KhelGrid. We are hiring engineers, sports scientists, scout coordinators, and high-performance tactical analysts to organize India's grassroots and Olympic sports ecosystem.",
      canonicalPath: "/careers",
      keywords:
        "KhelGrid careers, sports tech jobs India, sports data scientist, athlete scouting careers, sports journalism jobs",
      type: "website",
    }),
  component: CareersPage,
});

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  tags: string[];
}

const OPEN_ROLES: JobListing[] = [
  {
    id: "lead-sports-data-scientist",
    title: "Lead Sports Data Scientist & Quant Modeler",
    department: "High-Performance Analytics",
    location: "Bengaluru (Hybrid) / Remote",
    type: "Full-time",
    experience: "3-6 years",
    description:
      "Design predictive match models, athlete biomechanical progression indices, and real-time win-probability algorithms for cricket, athletics, and Olympic disciplines.",
    tags: ["Python", "Machine Learning", "Bayesian Statistics", "Sports Science"],
  },
  {
    id: "senior-frontend-engineer",
    title: "Senior Full-Stack / Frontend Engineer",
    department: "Core Platform Engineering",
    location: "Bengaluru / Remote",
    type: "Full-time",
    experience: "3-5 years",
    description:
      "Architect fast, accessible, offline-resilient web applications for athletes, venue operators, and talent scouts across India using React, TypeScript, and Vite.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Recharts", "PWA"],
  },
  {
    id: "regional-scout-lead-north",
    title: "Regional Scout Operations Lead (North Zone)",
    department: "Talent Scouting & Academy Onboarding",
    location: "New Delhi / Chandigarh / Rohtak",
    type: "Full-time",
    experience: "2-5 years",
    description:
      "Lead field verifications for grassroots trials, athletic academies, and sanctioned district tournaments. Build verified relationships with NIS-certified coaches.",
    tags: ["Scouting", "Field Operations", "Academy Relations", "District Leagues"],
  },
  {
    id: "sports-content-journalist",
    title: "Tactical Sports Journalist & Analytical Writer",
    department: "Editorial & Intelligence Desk",
    location: "Bengaluru / Mumbai / Remote",
    type: "Full-time",
    experience: "2-4 years",
    description:
      "Produce deep technical post-match analyses, high-performance breakdowns, and trial preparation playbooks for emerging Indian athletes.",
    tags: ["Sports Journalism", "Tactical Analysis", "Olympic Sports", "Copywriting"],
  },
  {
    id: "community-manager-grassroots",
    title: "Grassroots Athlete Community Specialist",
    department: "Athlete Growth & Support",
    location: "Remote (India)",
    type: "Full-time",
    experience: "1-3 years",
    description:
      "Support aspiring athletes, sports parents, and independent coaches navigating trial verifications, venue bookings, and sports scholarship applications.",
    tags: ["Community Operations", "Athlete Support", "Social Outreach"],
  },
];

function CareersPage() {
  const [selectedRole, setSelectedRole] = useState<string>(OPEN_ROLES[0].title);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [coverNote, setCoverNote] = useState("");

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      {/* Hero Section */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
            <Briefcase className="mr-1.5 h-3.5 w-3.5" /> We Are Hiring
          </Badge>
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            5 Open Roles
          </span>
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Build the Infrastructure Behind India&apos;s Next Generation of Champions
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          At KhelGrid, we believe no athlete should miss an opportunity due to lack of verified
          information, hidden fees, or gatekept scouting. We are assembling a team of builders,
          sports scientists, and operators obsessed with transforming Indian sports.
        </p>
      </div>

      {/* Values Grid */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-gradient-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
            <Trophy className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-foreground">Mission-Driven Impact</h2>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            Every feature you ship directly helps youth athletes in tier-2 and tier-3 towns find
            genuine trials and sanctioned opportunities.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 mb-3">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-foreground">Elite Analytical Standards</h2>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            We reject fluff and superficial metrics. We deploy quantitative models, biomechanical
            evaluations, and transparent verification checks.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 mb-3">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-foreground">Athlete-First Culture</h2>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            Competitive compensation, health benefits, athletic stipends, and a high-trust hybrid
            environment designed for focused execution.
          </p>
        </div>
      </div>

      {/* Open Roles Section */}
      <div className="mt-14">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Open Opportunities
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm mt-0.5">
              Explore open roles across engineering, data science, field scouting, and editorial
              operations.
            </p>
          </div>
          <a
            href="#apply-form"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Direct Application Form <ArrowRight className="h-3 w-3" />
          </a>
        </div>

        <div className="mt-6 space-y-4">
          {OPEN_ROLES.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-border bg-card/70 p-5 transition-all hover:border-primary/50 hover:shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-foreground">{job.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {job.department}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground sm:text-sm max-w-2xl leading-relaxed">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-primary" /> {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-3.5 w-3.5 text-primary" /> {job.experience}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-end justify-between gap-3 shrink-0">
                  <div className="flex flex-wrap gap-1">
                    {job.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedRole(job.title);
                      const formEl = document.getElementById("apply-form");
                      if (formEl) {
                        formEl.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="rounded-xl text-xs font-semibold"
                  >
                    Apply for Role
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Form */}
      <section
        id="apply-form"
        className="mt-14 rounded-3xl border border-border bg-gradient-card p-6 sm:p-9 shadow-sm"
      >
        <div className="max-w-2xl">
          <Badge variant="outline" className="border-primary/40 text-primary">
            Quick Application
          </Badge>
          <h2 className="mt-2 text-2xl font-bold text-foreground">Submit Your Profile</h2>
          <p className="text-xs text-muted-foreground sm:text-sm mt-1">
            Don&apos;t see an exact match? We always welcome exceptional athletes, coaches, and
            software builders.
          </p>
        </div>

        <>
          <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <h3 className="mt-3 text-lg font-bold text-foreground">Application Received</h3>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Thank you for applying to join KhelGrid. Our recruitment and talent desk will review
              your submission and reach out via email.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSubmitted(false)}
              className="mt-5 rounded-xl text-xs"
            >
              Submit Another Application
            </Button>
          </div>
        ) : (
          <form action="https://formsubmit.co/khelgrid@gmail.com" method="POST" encType="multipart/form-data" className="mt-6 grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="_subject" value="New KhelGrid Careers Application" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_next" value="https://www.khelgrid.com/careers?application=submitted" />
            <div aria-hidden="true" className="hidden">
              <label htmlFor="careers-website">Leave this field empty</label>
              <input id="careers-website" type="text" name="_honey" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="space-y-1">
              <label htmlFor="careers-full-name" className="text-xs font-semibold text-foreground">
                Full Name *
              </label>
              <Input
                id="careers-full-name"
                name="Full name"
                placeholder="e.g. Rohan Varma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="careers-email" className="text-xs font-semibold text-foreground">
                Email Address *
              </label>
              <Input
                id="careers-email"
                name="Applicant email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="careers-phone" className="text-xs font-semibold text-foreground">
                Phone / WhatsApp
              </label>
              <Input
                id="careers-phone"
                name="Phone / WhatsApp"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="careers-role" className="text-xs font-semibold text-foreground">
                Position of Interest *
              </label>
              <select
                id="careers-role"
                name="Position of interest"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium"
              >
                {OPEN_ROLES.map((role) => (
                  <option key={role.id} value={role.title}>
                    {role.title} ({role.department})
                  </option>
                ))}
                <option value="General Interest">General Interest / Open Candidate</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label htmlFor="careers-portfolio" className="text-xs font-semibold text-foreground">
                LinkedIn Profile / GitHub / Portfolio Link
              </label>
              <Input
                id="careers-portfolio"
                name="Portfolio / LinkedIn / GitHub"
                placeholder="https://linkedin.com/in/username or https://github.com/username"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label htmlFor="careers-cover-note" className="text-xs font-semibold text-foreground">
                Why KhelGrid? (Tell us briefly about your sports or engineering background)
              </label>
              <Textarea
                id="careers-cover-note"
                name="Cover note"
                rows={3}
                placeholder="Share your experience, achievements, or why you want to work on Indian sports infrastructure…"
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label htmlFor="careers-cv" className="text-xs font-semibold text-foreground">CV / Resume * (PDF, DOC or DOCX; max 10 MB)</label>
              <input id="careers-cv" name="attachment" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required className="block w-full rounded-xl border border-input bg-background px-3 py-2 text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:font-semibold file:text-primary-foreground" />
              <p className="text-xs text-muted-foreground">Your application and attached CV will be emailed to khelgrid@gmail.com via FormSubmit. Please do not include sensitive information that is not needed for your application.</p>
            </div>
            <div className="sm:col-span-2 flex justify-end pt-2">
              <Button
                type="submit"
                className="rounded-xl px-6 text-xs font-semibold"
              >
                <Send className="mr-1.5 h-3.5 w-3.5" />
                Send CV & Application
              </Button>
            </div>
          </form>
        </>
      </section>
    </main>
  );
}
