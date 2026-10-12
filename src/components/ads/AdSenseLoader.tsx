import { AdSenseWrapper } from "./AdSenseWrapper";

/**
 * Initializes Google AdSense with the service layer and manages the script injection
 * and mobile lifecycle, strictly guarded by the conditional wrapper ensuring VITE_GOOGLE_ADSENSE_ID
 * is present and preventing errors during hydration or missing variable scenarios.
 */
export function AdSenseLoader() {
  return <AdSenseWrapper loadScript={true} />;
}
