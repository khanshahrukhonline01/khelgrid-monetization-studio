import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

const requiredFiles = [
  "AGENTS.md",
  "GEMINI.md",
  "docs/TRIALS_AND_OPPORTUNITIES_DATA_SOP.md",
  "supabase/migrations/20261024010000_standardize_trial_opportunity_review.sql",
];

const missing = requiredFiles.filter((file) => !existsSync(file));
if (missing.length) {
  console.error("Trial/opportunity policy files are missing:", missing.join(", "));
  process.exit(1);
}

const eventPath = process.env.GITHUB_EVENT_PATH;
if (!eventPath || !existsSync(eventPath)) {
  console.log("Policy documents are present. No GitHub event payload; PR-specific checks skipped.");
  process.exit(0);
}

const event = JSON.parse(readFileSync(eventPath, "utf8"));
const baseSha = event.pull_request?.base?.sha;
const headSha = event.pull_request?.head?.sha;
if (!baseSha || !headSha) {
  console.log("Policy documents are present. No pull request diff to inspect.");
  process.exit(0);
}

let changed;
try {
  changed = execFileSync("git", ["diff", "--name-only", baseSha, headSha], { encoding: "utf8" })
    .split("\n").map((s) => s.trim()).filter(Boolean);
} catch (error) {
  console.error("Unable to inspect PR changes for data-policy compliance.", error);
  process.exit(1);
}

const sensitivePatterns = [
  /^src\/data\/trials\.ts$/,
  /^src\/lib\/.*trial.*service/i,
  /^src\/.*opportunit/i,
  /^supabase\/migrations\//,
  /^scripts\/.*(trial|opportunit|import)/i,
];
const sensitiveChanges = changed.filter((file) => sensitivePatterns.some((pattern) => pattern.test(file)));

if (!sensitiveChanges.length) {
  console.log("No trial/opportunity data-sensitive files changed.");
  process.exit(0);
}

const body = event.pull_request.body || "";
const requiredAttestations = [
  "SOP reviewed: yes",
  "Sources checked:",
  "Records created/updated/skipped/rejected:",
  "Tests performed:",
];
const missingAttestations = requiredAttestations.filter((phrase) => !body.includes(phrase));

if (missingAttestations.length) {
  console.error("This PR changes trial/opportunity data paths and must document SOP compliance.");
  console.error("Changed files:", sensitiveChanges.join(", "));
  console.error("Add these exact headings/attestations to the PR description:");
  for (const phrase of missingAttestations) console.error("- " + phrase);
  process.exit(1);
}

console.log("Trial/opportunity policy gate passed for:", sensitiveChanges.join(", "));
