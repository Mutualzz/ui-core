import {
  getCustomFontCssFamily,
  isCustomFontRef,
  parseCustomFontHash,
} from "./fontRefs";

export type FontCategory =
  | "sans-serif"
  | "serif"
  | "display"
  | "monospace"
  | "handwriting";

export type FontProvider = "google" | "fontshare";

export interface FontDefinition {
  id: string;
  family: string;
  category: FontCategory;
  weights: readonly number[];
  provider: FontProvider;
}

export const DEFAULT_FONT_FAMILY = "Rubik";

const google = (
  id: string,
  family: string,
  category: FontCategory,
  weights: readonly number[],
): FontDefinition => ({
  id,
  family,
  category,
  weights,
  provider: "google",
});

const fontshare = (
  id: string,
  family: string,
  category: FontCategory,
  weights: readonly number[],
): FontDefinition => ({
  id,
  family,
  category,
  weights,
  provider: "fontshare",
});

export const FONT_CATALOG: readonly FontDefinition[] = [
  google("rubik", "Rubik", "sans-serif", [400, 500, 600, 700]),
  google("inter", "Inter", "sans-serif", [400, 500, 600, 700]),
  google("roboto", "Roboto", "sans-serif", [400, 500, 700]),
  google("open-sans", "Open Sans", "sans-serif", [400, 600, 700]),
  google("lato", "Lato", "sans-serif", [400, 700]),
  google("montserrat", "Montserrat", "sans-serif", [400, 500, 600, 700]),
  google("poppins", "Poppins", "sans-serif", [400, 500, 600, 700]),
  google("nunito", "Nunito", "sans-serif", [400, 600, 700]),
  google("raleway", "Raleway", "sans-serif", [400, 500, 600, 700]),
  google("work-sans", "Work Sans", "sans-serif", [400, 500, 600, 700]),
  google("merriweather", "Merriweather", "serif", [400, 700]),
  google("playfair-display", "Playfair Display", "serif", [400, 600, 700]),
  google("jetbrains-mono", "JetBrains Mono", "monospace", [400, 500, 600, 700]),
  google("fira-code", "Fira Code", "monospace", [400, 500, 600, 700]),
  google("oswald", "Oswald", "display", [400, 500, 600, 700]),
  google("bebas-neue", "Bebas Neue", "display", [400]),
  google("dancing-script", "Dancing Script", "handwriting", [400, 600, 700]),
  google("pacifico", "Pacifico", "handwriting", [400]),
  fontshare("clash-display", "Clash Display", "display", [400, 500, 600, 700]),
  fontshare("satoshi", "Satoshi", "sans-serif", [400, 500, 700]),
  fontshare("cabinet-grotesk", "Cabinet Grotesk", "sans-serif", [400, 500, 700]),
  fontshare("general-sans", "General Sans", "sans-serif", [400, 500, 600, 700]),
  fontshare("switzer", "Switzer", "sans-serif", [400, 500, 600, 700]),
  fontshare("chillax", "Chillax", "display", [400, 500, 600, 700]),
  fontshare("synonym", "Synonym", "serif", [400, 500, 600, 700]),
  fontshare("archivo", "Archivo", "sans-serif", [400, 500, 600, 700]),
  fontshare("ranade", "Ranade", "serif", [400, 500, 700]),
  fontshare("stardom", "Stardom", "display", [400]),
] as const;

export const ALLOWED_FONT_FAMILIES = FONT_CATALOG.map((font) => font.family);

const catalogById = new Map(FONT_CATALOG.map((font) => [font.id, font]));
const catalogByFamily = new Map(
  FONT_CATALOG.map((font) => [font.family.toLowerCase(), font]),
);

export function getFontById(id: string | null | undefined) {
  if (!id) return undefined;
  return catalogById.get(id) ?? catalogByFamily.get(id.toLowerCase());
}

export function getFontByFamily(family: string | null | undefined) {
  if (!family) return undefined;
  return catalogByFamily.get(family.toLowerCase());
}

export function isAllowedFontFamily(family: string | null | undefined) {
  if (!family) return true;
  return catalogByFamily.has(family.toLowerCase());
}

export function resolveFontFamilyCss(
  family: string | null | undefined,
  fallback = DEFAULT_FONT_FAMILY,
) {
  if (!family) return formatFontFamilyCss(fallback);

  const customHash = parseCustomFontHash(family);
  if (customHash) {
    return formatFontFamilyCss(getCustomFontCssFamily(customHash));
  }

  const resolved = getFontByFamily(family)?.family ?? family;
  return formatFontFamilyCss(resolved);
}

export function formatFontFamilyCss(family: string) {
  return `'${family}', system-ui, sans-serif`;
}

export function getFontWeights(family: string | null | undefined) {
  return getFontByFamily(family)?.weights ?? [400, 500, 600, 700];
}

export function extractPrimaryFontFamily(fontFamily: string | null | undefined) {
  if (!fontFamily) return undefined;
  if (isCustomFontRef(fontFamily)) return fontFamily;

  const match = fontFamily.match(/'([^']+)'|"([^"]+)"/);
  const primary = match?.[1] ?? match?.[2] ?? fontFamily.split(",")[0]?.trim();
  if (!primary) return undefined;
  return getFontByFamily(primary)?.family ?? primary;
}

export function searchFonts(query: string) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [...FONT_CATALOG];

  return FONT_CATALOG.filter((font) => {
    const providerLabel =
      font.provider === "fontshare" ? "fontshare indian type foundry" : "google bunny";
    return (
      font.family.toLowerCase().includes(trimmed) ||
      font.id.includes(trimmed) ||
      font.category.includes(trimmed) ||
      providerLabel.includes(trimmed)
    );
  });
}
