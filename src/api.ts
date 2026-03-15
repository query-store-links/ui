import type {
  ApiResponse,
  ApiResponseItem,
  NormalizedItem,
  PackageType,
} from "./types";
import { extractProductId } from "./utils/helpers";
import type { SearchFormData } from "./components/SearchForm";

type RawRecord = Record<string, unknown>;

function toCamelKeys(raw: RawRecord): ApiResponseItem {
  const out: RawRecord = {};
  for (const [k, v] of Object.entries(raw)) {
    out[k.charAt(0).toLowerCase() + k.slice(1)] = v;
  }
  return out as ApiResponseItem;
}

function pickArray(
  raw: RawRecord,
  ...keys: string[]
): ApiResponseItem[] | undefined {
  for (const key of keys) {
    const val = raw[key];
    if (Array.isArray(val)) return (val as RawRecord[]).map(toCamelKeys);
  }
  return undefined;
}

export function parseApiResponse(raw: unknown): ApiResponse {
  if (!raw || typeof raw !== "object") return {};
  // Normalize top-level keys to camelCase so AppxPackages, appxPackages, appx all resolve uniformly
  const r: RawRecord = {};
  for (const [k, v] of Object.entries(raw as RawRecord)) {
    r[k.charAt(0).toLowerCase() + k.slice(1)] = v;
  }
  return {
    appx: pickArray(r, "appxPackages", "appx"),
    nonAppx: pickArray(r, "nonAppxPackages", "nonAppx"),
  };
}

export function normalizeData(
  items: ApiResponseItem[] | undefined,
  type: PackageType,
): NormalizedItem[] {
  if (!items || !Array.isArray(items)) return [];
  return items.map((item) => ({
    name: item.fileName ?? "Unknown",
    size: item.fileSize ?? "N/A",
    url: item.fileLink ?? "#",
    expire: item.fileExpire,
    type,
  }));
}

export async function resolveLinks(
  backend: string,
  customMarket: string,
  formData: SearchFormData,
  signal: AbortSignal,
): Promise<NormalizedItem[]> {
  const apiUrl = `${backend.replace(/\/$/, "")}/api/links/resolve-all`;

  const finalInput =
    formData.identifierType === "ProductID"
      ? extractProductId(formData.productInput)
      : formData.productInput.trim();

  const payload = {
    ...formData,
    productInput: finalInput,
    market: customMarket || formData.market,
  };

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Server responded with ${res.status}: ${errorText.substring(0, 100)}`,
    );
  }

  const data = parseApiResponse(await res.json());
  const results = [
    ...normalizeData(data.appx, "APPX"),
    ...normalizeData(data.nonAppx, "Other"),
  ];

  if (results.length === 0) {
    throw new Error("No download links found for this product ID/URL.");
  }

  return results;
}
