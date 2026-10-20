/**
 * IndexNow Protocol Integration for Bing, Yandex, Naver, and Seznam.
 * Instant search engine URL discovery and indexing API.
 */

export const INDEXNOW_KEY = "6c71a3962bfa4c5ea1f5927c81d83ee6";
export const INDEXNOW_HOST = "www.khelgrid.com";
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

/**
 * Submits a list of updated or newly created URLs to the IndexNow API.
 */
export async function submitToIndexNow(urls: string[]): Promise<{
  success: boolean;
  status: number;
  submittedCount: number;
  message: string;
}> {
  if (!urls || urls.length === 0) {
    return {
      success: false,
      status: 400,
      submittedCount: 0,
      message: "No URLs provided for IndexNow submission.",
    };
  }

  // Ensure absolute URLs on the target host
  const normalizedUrls = urls
    .map((u) => {
      if (u.startsWith("http")) return u;
      return `https://${INDEXNOW_HOST}${u.startsWith("/") ? u : `/${u}`}`;
    })
    .slice(0, 10000); // IndexNow max limit per batch

  const payload: IndexNowPayload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: normalizedUrls,
  };

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    // IndexNow returns 200 (OK) or 202 (Accepted)
    const success = res.status === 200 || res.status === 202;
    return {
      success,
      status: res.status,
      submittedCount: normalizedUrls.length,
      message: success
        ? `Successfully submitted ${normalizedUrls.length} URLs to IndexNow.`
        : `IndexNow responded with HTTP ${res.status}.`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      status: 500,
      submittedCount: 0,
      message: `Failed to connect to IndexNow API: ${message}`,
    };
  }
}
