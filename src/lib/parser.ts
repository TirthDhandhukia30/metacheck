import type {
  ParsedMetaData,
  OpenGraphData,
  TwitterCardData,
  MetaData,
  TechnicalChecks,
  MetaSuggestion,
} from "../types/meta";

// Fast CORS proxies - race them for speed
const CORS_PROXIES = [
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
];

const FETCH_TIMEOUT = 8000; // 8 seconds max

async function fetchWithTimeout(url: string, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function fetchWithCorsProxy(url: string): Promise<{ html: string; finalUrl: string }> {
  // Race all proxies - first successful response wins
  const proxyPromises = CORS_PROXIES.map(async (proxyFn) => {
    const proxyUrl = proxyFn(url);
    const response = await fetchWithTimeout(proxyUrl, FETCH_TIMEOUT);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Basic validation - make sure we got HTML
    if (!html.includes('<') || html.length < 100) {
      throw new Error('Invalid HTML response');
    }

    return { html, finalUrl: url };
  });

  // Use Promise.any to get the first successful result
  try {
    return await Promise.any(proxyPromises);
  } catch (error) {
    // All proxies failed
    if (error instanceof AggregateError) {
      throw new Error("Failed to fetch URL. The site may be blocking requests or temporarily unavailable.");
    }
    throw error;
  }
}

export function parseHtml(html: string, url: string): ParsedMetaData {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const openGraph = extractOpenGraph(doc);
  const twitter = extractTwitterCard(doc);
  const meta = extractMeta(doc);
  const technical = extractTechnicalChecks(doc, html, url);
  const suggestions = generateSuggestions(openGraph, twitter, meta, technical);

  return {
    url,
    finalUrl: url,
    openGraph,
    twitter,
    meta,
    technical,
    suggestions,
    rawHtml: html,
  };
}

function getMetaContent(doc: Document, selectors: string[]): string | undefined {
  for (const selector of selectors) {
    const element = doc.querySelector(selector);
    if (element) {
      const content = element.getAttribute("content");
      if (content) return content;
    }
  }
  return undefined;
}

function extractOpenGraph(doc: Document): OpenGraphData {
  return {
    title: getMetaContent(doc, ['meta[property="og:title"]']),
    description: getMetaContent(doc, ['meta[property="og:description"]']),
    image: getMetaContent(doc, ['meta[property="og:image"]']),
    imageWidth: getMetaContent(doc, ['meta[property="og:image:width"]']),
    imageHeight: getMetaContent(doc, ['meta[property="og:image:height"]']),
    imageAlt: getMetaContent(doc, ['meta[property="og:image:alt"]']),
    url: getMetaContent(doc, ['meta[property="og:url"]']),
    type: getMetaContent(doc, ['meta[property="og:type"]']),
    siteName: getMetaContent(doc, ['meta[property="og:site_name"]']),
    locale: getMetaContent(doc, ['meta[property="og:locale"]']),
  };
}

function extractTwitterCard(doc: Document): TwitterCardData {
  return {
    card: getMetaContent(doc, ['meta[name="twitter:card"]', 'meta[property="twitter:card"]']),
    title: getMetaContent(doc, ['meta[name="twitter:title"]', 'meta[property="twitter:title"]']),
    description: getMetaContent(doc, ['meta[name="twitter:description"]', 'meta[property="twitter:description"]']),
    image: getMetaContent(doc, ['meta[name="twitter:image"]', 'meta[property="twitter:image"]']),
    imageAlt: getMetaContent(doc, ['meta[name="twitter:image:alt"]', 'meta[property="twitter:image:alt"]']),
    site: getMetaContent(doc, ['meta[name="twitter:site"]', 'meta[property="twitter:site"]']),
    creator: getMetaContent(doc, ['meta[name="twitter:creator"]', 'meta[property="twitter:creator"]']),
  };
}

function extractMeta(doc: Document): MetaData {
  const titleEl = doc.querySelector("title");
  const charsetEl = doc.querySelector("meta[charset]");
  const canonicalEl = doc.querySelector('link[rel="canonical"]');

  return {
    title: titleEl?.textContent || undefined,
    description: getMetaContent(doc, ['meta[name="description"]']),
    canonical: canonicalEl?.getAttribute("href") || undefined,
    robots: getMetaContent(doc, ['meta[name="robots"]']),
    author: getMetaContent(doc, ['meta[name="author"]']),
    keywords: getMetaContent(doc, ['meta[name="keywords"]']),
    viewport: getMetaContent(doc, ['meta[name="viewport"]']),
    charset: charsetEl?.getAttribute("charset") || undefined,
    themeColor: getMetaContent(doc, ['meta[name="theme-color"]']),
  };
}

function extractTechnicalChecks(doc: Document, html: string, url: string): TechnicalChecks {
  const faviconEl = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
  const charsetEl = doc.querySelector("meta[charset]");
  const viewportEl = doc.querySelector('meta[name="viewport"]');

  // Check for structured data (JSON-LD)
  const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
  const structuredDataTypes: string[] = [];

  jsonLdScripts.forEach((script) => {
    try {
      const data = JSON.parse(script.textContent || "");
      if (data["@type"]) {
        structuredDataTypes.push(data["@type"]);
      } else if (Array.isArray(data)) {
        data.forEach((item) => {
          if (item["@type"]) structuredDataTypes.push(item["@type"]);
        });
      }
    } catch {
      // Invalid JSON-LD
    }
  });

  return {
    favicon: faviconEl?.getAttribute("href") || undefined,
    charset: charsetEl?.getAttribute("charset") || undefined,
    viewport: viewportEl?.getAttribute("content") || undefined,
    isHttps: url.startsWith("https://"),
    hasRedirect: false,
    hasRobotsTxt: false,
    hasStructuredData: jsonLdScripts.length > 0,
    structuredDataTypes,
  };
}

function generateSuggestions(
  og: OpenGraphData,
  twitter: TwitterCardData,
  meta: MetaData,
  technical: TechnicalChecks
): MetaSuggestion[] {
  const suggestions: MetaSuggestion[] = [];

  // Meta title check
  if (!meta.title) {
    suggestions.push({
      tag: "title",
      type: "missing",
      message: "Missing page title",
      impact: "Critical for SEO and browser tabs",
    });
  } else if (meta.title.length > 60) {
    suggestions.push({
      tag: "title",
      type: "suboptimal",
      message: `Title is ${meta.title.length} characters (recommended: under 60)`,
      impact: "May be truncated in search results",
    });
  }

  // Meta description check
  if (!meta.description) {
    suggestions.push({
      tag: "meta description",
      type: "missing",
      message: "Missing meta description",
      impact: "Search engines may generate their own snippet",
    });
  } else if (meta.description.length > 160) {
    suggestions.push({
      tag: "meta description",
      type: "suboptimal",
      message: `Description is ${meta.description.length} characters (recommended: under 160)`,
      impact: "May be truncated in search results",
    });
  }

  // Open Graph checks
  if (!og.title) {
    suggestions.push({
      tag: "og:title",
      type: "missing",
      message: "Missing og:title",
      impact: "Social platforms will use page title as fallback",
    });
  }

  if (!og.description) {
    suggestions.push({
      tag: "og:description",
      type: "missing",
      message: "Missing og:description",
      impact: "Social previews may lack context",
    });
  }

  if (!og.image) {
    suggestions.push({
      tag: "og:image",
      type: "missing",
      message: "Missing og:image",
      impact: "No image in social previews significantly reduces engagement",
    });
  } else {
    if (!og.imageWidth || !og.imageHeight) {
      suggestions.push({
        tag: "og:image:width/height",
        type: "suboptimal",
        message: "Missing og:image:width and og:image:height",
        impact: "Platforms may render image incorrectly initially",
      });
    }
  }

  // Twitter Card checks
  if (!twitter.card) {
    suggestions.push({
      tag: "twitter:card",
      type: "missing",
      message: "Missing twitter:card",
      impact: "Twitter may not display rich preview",
    });
  }

  // Technical checks
  if (!technical.viewport) {
    suggestions.push({
      tag: "viewport",
      type: "missing",
      message: "Missing viewport meta tag",
      impact: "Page may not be mobile-friendly",
    });
  }

  if (!technical.isHttps) {
    suggestions.push({
      tag: "HTTPS",
      type: "suboptimal",
      message: "Site is not using HTTPS",
      impact: "Security warning in browsers, SEO penalty",
    });
  }

  return suggestions;
}

export async function analyzeUrl(url: string): Promise<ParsedMetaData> {
  // Ensure URL has protocol
  let normalizedUrl = url.trim();
  if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  const { html, finalUrl } = await fetchWithCorsProxy(normalizedUrl);
  const parsed = parseHtml(html, normalizedUrl);
  parsed.finalUrl = finalUrl;

  return parsed;
}
