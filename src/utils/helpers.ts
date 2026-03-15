export type PackageType = 'APPX' | 'Other';

// API response items can come in either camelCase or PascalCase
interface ApiItemCamel {
  fileName?: string;
  fileSize?: string;
  fileLink?: string;
  fileExpire?: string;
}

interface ApiItemPascal {
  FileName?: string;
  FileSize?: string;
  FileLink?: string;
  FileExpire?: string;
}

export type ApiResponseItem = ApiItemCamel & ApiItemPascal;

export interface ApiResponse {
  // camelCase variants
  appxPackages?: ApiResponseItem[];
  nonAppxPackages?: ApiResponseItem[];
  appx?: ApiResponseItem[];
  nonAppx?: ApiResponseItem[];
  // PascalCase variants
  Appx?: ApiResponseItem[];
  NonAppx?: ApiResponseItem[];
}

export interface NormalizedItem {
  name: string;
  size: string;
  url: string;
  expire: string | undefined;
  type: PackageType;
}

export const normalizeData = (items: ApiResponseItem[] | undefined, type: PackageType): NormalizedItem[] => {
  if (!items || !Array.isArray(items)) return [];
  return items.map(item => ({
    name: item.fileName ?? item.FileName ?? 'Unknown',
    size: item.fileSize ?? item.FileSize ?? 'N/A',
    url: item.fileLink ?? item.FileLink ?? '#',
    expire: item.fileExpire ?? item.FileExpire,
    type,
  }));
};

export const extractProductId = (input: string): string => {
  if (!input) return '';
  const trimmed = input.trim();

  try {
    const urlMatch = trimmed.match(/apps\.microsoft\.com\/(?:.*\/)?(?:detail|productId)\/([A-Z0-9]+)/i);
    if (urlMatch?.[1]) {
      return urlMatch[1].toUpperCase();
    }

    if (trimmed.includes('http')) {
      const url = new URL(trimmed);
      const pathSegments = url.pathname.split('/');
      for (const segment of pathSegments) {
        if (/^[A-Z0-9]{12,}$/i.test(segment)) {
          return segment.toUpperCase();
        }
      }
    }
  } catch { }

  if (/^[A-Z0-9]{12,}$/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  return trimmed;
};
