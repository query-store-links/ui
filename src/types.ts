export type PackageType = "APPX" | "Other";

export interface ApiResponseItem {
  fileName?: string;
  fileSize?: string;
  fileLink?: string;
  fileExpire?: string;
}

export interface ApiResponse {
  appx?: ApiResponseItem[];
  nonAppx?: ApiResponseItem[];
}

export interface NormalizedItem {
  name: string;
  size: string;
  url: string;
  expire: string | undefined;
  type: PackageType;
}
