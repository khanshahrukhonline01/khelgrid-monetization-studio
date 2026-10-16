import { describe, it, expect } from "vitest";
import { TRIALS_AND_OPPORTUNITIES_FAQS, generateTrialsFaqSchema } from "./trials-faq";
import { getSearchTrialsSeoMetadata } from "@/lib/search-trials-seo";
import { buildSeoHead } from "@/lib/seo";

describe("Trials and Opportunities Page FAQ JSON-LD Structured Data", () => {
  it("defines comprehensive FAQ items with question, answer, and category", () => {
    expect(TRIALS_AND_OPPORTUNITIES_FAQS.length).toBeGreaterThanOrEqual(8);

    TRIALS_AND_OPPORTUNITIES_FAQS.forEach((faq) => {
      expect(faq.id).toBeTruthy();
      expect(faq.question).toBeTruthy();
      expect(faq.question.endsWith("?")).toBe(true);
      expect(faq.answer).toBeTruthy();
      expect(faq.answer.length).toBeGreaterThan(40);
      expect(faq.category).toBeTruthy();
    });
  });

  it("covers critical trial topics including government quotas, SAI NCOE, BCCI, Kho-Kho, and Sports CV", () => {
    const questionsCombined = TRIALS_AND_OPPORTUNITIES_FAQS.map((f) => `${f.question} ${f.answer}`)
      .join(" ")
      .toLowerCase();

    expect(questionsCombined).toContain("khelgrid");
    expect(questionsCombined).toContain("free entry");
    expect(questionsCombined).toContain("aadhaar");
    expect(questionsCombined).toContain("sports quota");
    expect(questionsCombined).toContain("sports authority of india");
    expect(questionsCombined).toContain("bcci");
    expect(questionsCombined).toContain("kho-kho");
    expect(questionsCombined).toContain("sports cv");
  });

  it("generates Schema.org compliant FAQPage JSON-LD structured data", () => {
    const faqSchema = generateTrialsFaqSchema();

    expect(faqSchema["@context"]).toBe("https://schema.org");
    expect(faqSchema["@type"]).toBe("FAQPage");
    expect(faqSchema["@id"]).toBe("https://khelgrid.com/search#faq");
    expect(faqSchema.name).toContain("Frequently Asked Questions");
    expect(Array.isArray(faqSchema.mainEntity)).toBe(true);
    expect(faqSchema.mainEntity.length).toBe(TRIALS_AND_OPPORTUNITIES_FAQS.length);

    faqSchema.mainEntity.forEach((item, index) => {
      expect(item["@type"]).toBe("Question");
      expect(item.name).toBe(TRIALS_AND_OPPORTUNITIES_FAQS[index].question);
      expect(item.acceptedAnswer["@type"]).toBe("Answer");
      expect(item.acceptedAnswer.text).toBe(TRIALS_AND_OPPORTUNITIES_FAQS[index].answer);
    });
  });

  it("integrates FAQPage schema into getSearchTrialsSeoMetadata jsonLdData", () => {
    const seoMeta = getSearchTrialsSeoMetadata({ query: "crpf" });
    const faqInJsonLd = seoMeta.jsonLdData.find((item) => item["@type"] === "FAQPage");

    expect(faqInJsonLd).toBeDefined();
    expect((faqInJsonLd as { "@type": string })["@type"]).toBe("FAQPage");
    expect(
      (faqInJsonLd as { mainEntity: Array<unknown> }).mainEntity.length,
    ).toBeGreaterThanOrEqual(8);
  });

  it("renders valid JSON-LD script tag in buildSeoHead output for search route", () => {
    const faqSchema = generateTrialsFaqSchema();
    const seoHead = buildSeoHead({
      title: "Search Trials and Opportunities in India · KhelGrid",
      description: "Filter and discover sports selection trials and opportunities across India.",
      canonicalPath: "/search",
      customSchema: [faqSchema],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(faqSchema),
        },
      ],
    });

    // Check script contains FAQPage
    const jsonLdScript = seoHead.scripts.find(
      (s) =>
        s.type === "application/ld+json" &&
        typeof s.children === "string" &&
        s.children.includes("FAQPage"),
    );

    expect(jsonLdScript).toBeDefined();
    const parsed = JSON.parse(jsonLdScript!.children as string);
    // Can be either the standalone FAQPage schema or the @graph containing FAQPage
    const hasFaqPage =
      parsed["@type"] === "FAQPage" ||
      (Array.isArray(parsed["@graph"]) &&
        parsed["@graph"].some((g: { "@type": string }) => g["@type"] === "FAQPage"));
    expect(hasFaqPage).toBe(true);
  });
});
