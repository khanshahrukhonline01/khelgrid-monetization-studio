import districtData from "./khelsathi-infrastructure.json";

export interface StadiumInfo {
  id: string;
  name: string;
  mapUrl?: string;
  coordinates?: { lat: number; lng: number };
}

export interface DistrictInfrastructure {
  cityId: string;
  districtName: string;
  facilitiesRaw: string;
  facilities: string[];
  stadiums: StadiumInfo[];
}

export const DISTRICT_INFRASTRUCTURE_DATA = districtData as DistrictInfrastructure[];

export const POPULAR_UP_DISTRICTS = [
  "Lucknow",
  "Kanpur Nagar",
  "Varanasi",
  "Agra",
  "Prayagraj",
  "Meerut",
  "Gorakhpur",
  "Ayodhya",
  "Bareilly",
  "Ghaziabad",
  "Gautam Buddha Nagar",
  "Jhansi",
  "Aligarh",
  "Saharanpur",
];

export function getDistrictInfrastructureByName(name: string): DistrictInfrastructure | undefined {
  const norm = name.trim().toLowerCase();
  return DISTRICT_INFRASTRUCTURE_DATA.find(
    (d) =>
      d.districtName.toLowerCase() === norm ||
      d.districtName.toLowerCase().includes(norm) ||
      norm.includes(d.districtName.toLowerCase()),
  );
}

export function getAllDistrictsList(): string[] {
  return DISTRICT_INFRASTRUCTURE_DATA.map((d) => d.districtName);
}
