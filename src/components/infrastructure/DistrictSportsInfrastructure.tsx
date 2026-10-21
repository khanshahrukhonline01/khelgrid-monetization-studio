import React, { useState, useMemo } from "react";
import {
  DISTRICT_INFRASTRUCTURE_DATA,
  POPULAR_UP_DISTRICTS,
  type DistrictInfrastructure,
  type StadiumInfo,
} from "@/data/district-infrastructure";
import {
  Building2,
  MapPin,
  ExternalLink,
  Search,
  Sparkles,
  Navigation,
  X,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DistrictSportsInfrastructureProps {
  initialDistrict?: string;
  className?: string;
  compact?: boolean;
}

export function DistrictSportsInfrastructure({
  initialDistrict = "Lucknow",
  className = "",
  compact = false,
}: DistrictSportsInfrastructureProps) {
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>(initialDistrict);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStadiumForMap, setSelectedStadiumForMap] = useState<StadiumInfo | null>(null);

  // Filter districts based on search
  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return DISTRICT_INFRASTRUCTURE_DATA;
    const q = searchQuery.toLowerCase().trim();
    return DISTRICT_INFRASTRUCTURE_DATA.filter((d) =>
      d.districtName.toLowerCase().includes(q) ||
      d.stadiums.some((s) => s.name.toLowerCase().includes(q)) ||
      d.facilities.some((f) => f.toLowerCase().includes(q)),
    );
  }, [searchQuery]);

  // Current active district
  const currentDistrict = useMemo(() => {
    const found = DISTRICT_INFRASTRUCTURE_DATA.find(
      (d) => d.districtName.toLowerCase() === selectedDistrictName.toLowerCase(),
    );
    return found || DISTRICT_INFRASTRUCTURE_DATA[0];
  }, [selectedDistrictName]);

  const totalStadiums = useMemo(
    () => DISTRICT_INFRASTRUCTURE_DATA.reduce((acc, d) => acc + d.stadiums.length, 0),
    [],
  );

  return (
    <div className={`w-full overflow-hidden rounded-3xl border border-border/80 bg-card/60 shadow-sm backdrop-blur-sm ${className}`}>
      {/* Khel Sathi Official UP Sports Infrastructure Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 p-6 sm:p-8 text-white">
        {/* Subtle decorative glow */}
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-purple-200 backdrop-blur-md border border-white/15">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Department of Sports · Government of Uttar Pradesh
              </span>
              <Badge variant="outline" className="border-amber-400/40 bg-amber-400/10 text-amber-300 text-[11px]">
                Khel Sathi Portal Verified
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              District-wise Sports Infrastructure
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/90 max-w-2xl leading-relaxed">
              Complete inventory of government sports stadiums, Olympic swimming pools, synthetic tracks,
              multipurpose halls, and hostels across all 75+ districts of Uttar Pradesh.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3 text-center min-w-[100px]">
              <div className="text-xl sm:text-2xl font-black text-amber-300">
                {DISTRICT_INFRASTRUCTURE_DATA.length}
              </div>
              <div className="text-[10px] font-medium text-purple-200 uppercase tracking-wider">
                Districts
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3 text-center min-w-[100px]">
              <div className="text-xl sm:text-2xl font-black text-emerald-300">{totalStadiums}+</div>
              <div className="text-[10px] font-medium text-purple-200 uppercase tracking-wider">
                Stadiums
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* District Search & Popular Quick Pills */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search district, stadium (e.g. K.D. Singh Babu, Eklavya) or facility..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-xs sm:text-sm bg-background border-border/80"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <a
                href="https://khelsathi.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                <span>khelsathi.in</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Quick District Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[11px] font-semibold text-muted-foreground shrink-0 flex items-center gap-1">
              <Navigation className="h-3 w-3 text-primary" /> Popular:
            </span>
            {POPULAR_UP_DISTRICTS.map((dist) => {
              const isSelected = selectedDistrictName.toLowerCase() === dist.toLowerCase();
              return (
                <button
                  key={dist}
                  type="button"
                  onClick={() => {
                    setSelectedDistrictName(dist);
                    setSearchQuery("");
                  }}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {dist}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main District Explorer Layout */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: District List (Scrollable on larger screens) */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-2 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                All Districts ({filteredDistricts.length})
              </span>
              <span className="text-[10px] text-muted-foreground">Tap to inspect</span>
            </div>

            <div className="max-h-[380px] sm:max-h-[460px] overflow-y-auto space-y-1 pr-1">
              {filteredDistricts.map((d) => {
                const isSelected = selectedDistrictName.toLowerCase() === d.districtName.toLowerCase();
                return (
                  <button
                    key={d.cityId}
                    type="button"
                    onClick={() => setSelectedDistrictName(d.districtName)}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-purple-600/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 font-bold"
                        : "text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Building2 className={`h-4 w-4 shrink-0 ${isSelected ? "text-purple-600 dark:text-purple-400" : "text-muted-foreground"}`} />
                      <span className="truncate">{d.districtName}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 text-[11px] text-muted-foreground">
                      <span>{d.stadiums.length} venues</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active District Infrastructure Details (matching khelsathi.in layout) */}
          <div className="lg:col-span-8 rounded-2xl border border-border bg-gradient-to-b from-card via-card to-background p-5 sm:p-7 shadow-sm space-y-6">
            {/* Header: District Name & Overview */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
                    {currentDistrict.districtName}
                  </h3>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-600 dark:text-purple-400 font-semibold text-xs">
                    Uttar Pradesh
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Official District Sports Infrastructure Directory · Source: Khel Sathi Portal (Govt of UP)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="text-xs h-8 rounded-lg cursor-pointer"
                >
                  <a
                    href={`https://www.google.com/maps/search/sports+stadium+in+${encodeURIComponent(currentDistrict.districtName + ", Uttar Pradesh")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="mr-1.5 h-3.5 w-3.5 text-primary" />
                    Open Map Search
                  </a>
                </Button>
              </div>
            </div>

            {/* Stadiums / Venues List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Government Stadiums &amp; Mini Stadiums ({currentDistrict.stadiums.length})
              </h4>

              {currentDistrict.stadiums.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {currentDistrict.stadiums.map((stadium, idx) => (
                    <div
                      key={stadium.id || idx}
                      className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-purple-500/40 hover:shadow-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                          {/* Stadium Icon */}
                          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <span className="line-clamp-2 leading-tight">{stadium.name}</span>
                        </div>
                      </div>

                      <div className="mt-3.5 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                        {stadium.coordinates ? (
                          <span className="text-[11px] text-muted-foreground">
                            GPS: {stadium.coordinates.lat.toFixed(3)}, {stadium.coordinates.lng.toFixed(3)}
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">Verified Venue</span>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedStadiumForMap(stadium)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                        >
                          <MapPin className="h-3.5 w-3.5" />
                          <span>View Map</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-5 text-center text-xs text-muted-foreground">
                  Regional sports facilities available under District Sports Office (DSO).
                </div>
              )}
            </div>

            {/* Complete Facilities Inventory (matching text from screenshot) */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Available Sports Infrastructure &amp; Amenities
              </h4>

              {currentDistrict.facilities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {currentDistrict.facilities.map((fac, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-lg border border-border/70 bg-secondary/40 px-2.5 py-1 text-xs text-foreground font-medium"
                    >
                      {fac}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {currentDistrict.facilitiesRaw || "Main ground, training tracks, and outdoor sports fields."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Google Map Modal (View Map feature from khelsathi.in) */}
      {selectedStadiumForMap && (
        <Dialog open={!!selectedStadiumForMap} onOpenChange={(o) => !o && setSelectedStadiumForMap(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span>{selectedStadiumForMap.name}</span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Official Google Maps location for sports trials and training access.
              </DialogDescription>
            </DialogHeader>

            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
              {selectedStadiumForMap.mapUrl ? (
                <iframe
                  title={selectedStadiumForMap.name}
                  src={
                    selectedStadiumForMap.mapUrl.startsWith("//")
                      ? `https:${selectedStadiumForMap.mapUrl}`
                      : selectedStadiumForMap.mapUrl
                  }
                  className="h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <iframe
                  title={selectedStadiumForMap.name}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    selectedStadiumForMap.name + ", " + currentDistrict.districtName + ", Uttar Pradesh",
                  )}&z=15&output=embed`}
                  className="h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-muted-foreground">Source: Khel Sathi Portal, Uttar Pradesh</span>
              <Button
                asChild
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold cursor-pointer"
              >
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    selectedStadiumForMap.name + ", " + currentDistrict.districtName,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="mr-1.5 h-3.5 w-3.5" />
                  Open in Google Maps App
                </a>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default DistrictSportsInfrastructure;
