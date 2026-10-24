import fs from "node:fs";

async function run() {
  console.log("Fetching khelsathi.in homepage...");
  const res = await fetch("https://khelsathi.in/");
  const html = await res.text();

  // Extract all data-id and id from <path> tags
  const pathRegex = /<path[^>]*data-id="(\d+)"[^>]*id="([^"]+)"[^>]*>/gi;
  const districtsMap = new Map<string, string>();
  let match;
  while ((match = pathRegex.exec(html)) !== null) {
    districtsMap.set(match[1], match[2]);
  }

  // Also check if any data-id appears elsewhere in html
  const anyIdRegex = /data-id="(\d+)"/g;
  while ((match = anyIdRegex.exec(html)) !== null) {
    if (!districtsMap.has(match[1])) {
      districtsMap.set(match[1], `District_${match[1]}`);
    }
  }

  // Also check all IDs from 510 to 620 just in case any district wasn't in SVG
  for (let i = 510; i <= 620; i++) {
    if (!districtsMap.has(String(i))) {
      districtsMap.set(String(i), `District_${i}`);
    }
  }

  console.log(`Found ${districtsMap.size} potential district IDs to query.`);

  interface StadiumInfo {
    id: string;
    name: string;
    mapUrl?: string;
    coordinates?: { lat: number; lng: number };
  }

  interface DistrictInfrastructure {
    cityId: string;
    districtName: string;
    facilitiesRaw: string;
    facilities: string[];
    stadiums: StadiumInfo[];
  }

  const results: DistrictInfrastructure[] = [];

  for (const [cityId, defaultName] of districtsMap.entries()) {
    try {
      const response = await fetch("https://khelsathi.in/ajax.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ city_id: cityId }).toString(),
      });

      const districtHtml = await response.text();
      if (!districtHtml || districtHtml.trim().length < 20) {
        continue;
      }

      // Extract District Name
      const nameMatch = districtHtml.match(/<h2>([^<]+)<\/h2>/i);
      const districtName = nameMatch ? nameMatch[1].trim() : defaultName;

      // Extract facilities text from <p>...</p>
      let facilitiesRaw = "";
      const pMatch = districtHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
      if (pMatch) {
        facilitiesRaw = pMatch[1].replace(/<[^>]*>/g, " ").trim();
      }

      // Extract individual stadiums: <strong>Name</strong> ... show_map(ID)
      const stadiumRegex = /<strong>([^<]+)<\/strong>[^<]*<a[^>]*onclick="show_map\((\d+)\)"/gi;
      const stadiums: StadiumInfo[] = [];
      let sMatch;
      while ((sMatch = stadiumRegex.exec(districtHtml)) !== null) {
        const sName = sMatch[1].trim();
        const sId = sMatch[2];
        stadiums.push({
          id: sId,
          name: sName,
        });
      }

      // If no onclick="show_map" but has strong tags
      if (stadiums.length === 0) {
        const strongRegex = /<strong>([^<]+)<\/strong>/gi;
        let altMatch;
        while ((altMatch = strongRegex.exec(districtHtml)) !== null) {
          const sName = altMatch[1].trim();
          if (sName && !sName.toLowerCase().includes("view map")) {
            stadiums.push({ id: `custom_${cityId}`, name: sName });
          }
        }
      }

      // Parse facilities into clean array
      const facilities = facilitiesRaw
        ? facilitiesRaw
            .split(/[,;\n]+/)
            .map((f) => f.trim())
            .filter((f) => f.length > 2)
        : [];

      results.push({
        cityId,
        districtName,
        facilitiesRaw,
        facilities,
        stadiums,
      });

      console.log(
        `[OK] ${districtName} (ID: ${cityId}) - ${stadiums.length} stadiums, ${facilities.length} facilities`,
      );
    } catch (err) {
      console.error(`Error fetching cityId ${cityId}:`, err);
    }
  }

  // Now fetch map coordinates for all stadiums
  console.log("\nFetching map coordinates for extracted stadiums...");
  const stadiumMapCache = new Map<string, { mapUrl: string; lat?: number; lng?: number }>();
  for (const d of results) {
    for (const s of d.stadiums) {
      if (s.id && !s.id.startsWith("custom_")) {
        if (!stadiumMapCache.has(s.id)) {
          try {
            const mRes = await fetch("https://khelsathi.in/ajax.php", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({ stadium_id: s.id }).toString(),
            });
            const mHtml = await mRes.text();
            const iframeMatch = mHtml.match(/src=["']([^"']+)["']/i);
            if (iframeMatch) {
              const mapUrl = iframeMatch[1];
              let lat: number | undefined;
              let lng: number | undefined;
              const qMatch = mapUrl.match(/q=([\d.-]+),([\d.-]+)/);
              if (qMatch) {
                lat = parseFloat(qMatch[1]);
                lng = parseFloat(qMatch[2]);
              }
              stadiumMapCache.set(s.id, { mapUrl, lat, lng });
            }
          } catch {
            // ignore
          }
        }
        const cached = stadiumMapCache.get(s.id);
        if (cached) {
          s.mapUrl = cached.mapUrl;
          if (cached.lat && cached.lng) {
            s.coordinates = { lat: cached.lat, lng: cached.lng };
          }
        }
      }
    }
  }

  // Sort alphabetically by district name
  results.sort((a, b) => a.districtName.localeCompare(b.districtName));

  const outputPath = "src/data/khelsathi-infrastructure.json";
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf8");
  console.log(`\nSuccessfully saved ${results.length} districts to ${outputPath}`);
}

run();
