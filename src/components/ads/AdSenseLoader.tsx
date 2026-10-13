import { AdSenseWrapper } from "./AdSenseWrapper";
import { useAdSenseDiagnostics } from "@/hooks/use-adsense-diagnostics";

/**
 * Initializes Google AdSense with the service layer and manages the script injection
 * and mobile lifecycle, strictly guarded by the conditional wrapper ensuring VITE_GOOGLE_ADSENSE_ID
 * is present and preventing errors during hydration or missing variable scenarios.
 * Also runs diagnostic monitoring to report any AdSense script load state changes or
 * initialization errors directly to the console.
 */
export function AdSenseLoader() {
  useAdSenseDiagnostics();
  return <AdSenseWrapper loadScript={true} />;
}
