export interface OpenGraphData {
  title?: string;
  description?: string;
  image?: string;
  imageWidth?: string;
  imageHeight?: string;
  imageAlt?: string;
  url?: string;
  type?: string;
  siteName?: string;
  locale?: string;
}

export interface TwitterCardData {
  card?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  site?: string;
  creator?: string;
}

export interface MetaData {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
  author?: string;
  keywords?: string;
  viewport?: string;
  charset?: string;
  themeColor?: string;
}

export interface TechnicalChecks {
  favicon?: string;
  charset?: string;
  viewport?: string;
  isHttps: boolean;
  hasRedirect: boolean;
  hasRobotsTxt: boolean;
  hasStructuredData: boolean;
  structuredDataTypes: string[];
}

export interface MetaSuggestion {
  tag: string;
  type: "missing" | "suboptimal" | "info";
  message: string;
  impact: string;
}

export interface ParsedMetaData {
  url: string;
  finalUrl: string;
  openGraph: OpenGraphData;
  twitter: TwitterCardData;
  meta: MetaData;
  technical: TechnicalChecks;
  suggestions: MetaSuggestion[];
  rawHtml?: string;
}

export type SocialPlatform = "facebook" | "twitter" | "linkedin" | "whatsapp" | "discord";

export interface PlatformPreviewConfig {
  name: string;
  aspectRatio: string;
  maxWidth: number;
  maxHeight: number;
  imageAspect: string;
}

export const PLATFORM_CONFIGS: Record<SocialPlatform, PlatformPreviewConfig> = {
  facebook: {
    name: "Facebook",
    aspectRatio: "1.91 / 1",
    maxWidth: 527,
    maxHeight: 276,
    imageAspect: "1.91:1",
  },
  twitter: {
    name: "Twitter / X",
    aspectRatio: "1.91 / 1",
    maxWidth: 506,
    maxHeight: 265,
    imageAspect: "1.91:1",
  },
  linkedin: {
    name: "LinkedIn",
    aspectRatio: "1.91 / 1",
    maxWidth: 552,
    maxHeight: 289,
    imageAspect: "1.91:1",
  },
  whatsapp: {
    name: "WhatsApp",
    aspectRatio: "1 / 1",
    maxWidth: 300,
    maxHeight: 300,
    imageAspect: "1:1",
  },
  discord: {
    name: "Discord",
    aspectRatio: "1.91 / 1",
    maxWidth: 400,
    maxHeight: 209,
    imageAspect: "1.91:1",
  },
};
