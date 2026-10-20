import { describe, it, expect } from "vitest";
import { ACADEMY_FAQS, generateAcademyFaqSchema } from "./academy-faq";

describe("Academy FAQs & FAQPage Structured Data", () => {
  it("exports valid ACADEMY_FAQS array with rich questions and answers", () => {
    expect(ACADEMY_FAQS.length).toBeGreaterThanOrEqual(6);

    for (const faq of ACADEMY_FAQS) {
      expect(faq.id).toBeTruthy();
      expect(faq.question).toBeTruthy();
      expect(faq.question.length).toBeGreaterThan(15);
      expect(faq.answer).toBeTruthy();
      expect(faq.answer.length).toBeGreaterThan(50);
      expect(faq.category).toBeTruthy();
    }
  });

  it("generates Schema.org compliant FAQPage JSON-LD", () => {
    const schema = generateAcademyFaqSchema();

    expect(schema["@type"]).toBe("FAQPage");
    expect(Array.isArray(schema.mainEntity)).toBe(true);
    expect(schema.mainEntity.length).toBe(ACADEMY_FAQS.length);

    for (const item of schema.mainEntity) {
      expect(item["@type"]).toBe("Question");
      expect(typeof item.name).toBe("string");
      expect(item.name.length).toBeGreaterThan(0);
      expect(item.acceptedAnswer["@type"]).toBe("Answer");
      expect(typeof item.acceptedAnswer.text).toBe("string");
      expect(item.acceptedAnswer.text.length).toBeGreaterThan(0);
    }
  });

  it("covers key user questions about Khelo India, scholarships, and admissions", () => {
    const questionsText = ACADEMY_FAQS.map((f) => f.question.toLowerCase()).join(" ");
    expect(questionsText).toContain("khelo india");
    expect(questionsText).toContain("scholarships");
    expect(questionsText).toContain("age criteria");
    expect(questionsText).toContain("facilities");
  });
});
