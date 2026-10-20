import fs from "node:fs";
import path from "node:path";
import { buildSitemapXml } from "../src/routes/sitemap[.]xml";

const xml = buildSitemapXml();

// Write to root sitemap.xml and public/sitemap.xml
fs.writeFileSync(path.resolve(process.cwd(), "sitemap.xml"), xml, "utf8");
fs.writeFileSync(path.resolve(process.cwd(), "public/sitemap.xml"), xml, "utf8");

console.log("Successfully wrote sitemap.xml to root and public/ directory!");
console.log(`Generated ${xml.split("</url>").length - 1} URLs in sitemap.`);
