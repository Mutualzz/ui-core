export const CUSTOM_FONT_PREFIX = "font:" as const;
export const CUSTOM_FONT_EXTENSIONS = ["woff2", "woff", "ttf", "otf"] as const;
export type CustomFontExt = (typeof CUSTOM_FONT_EXTENSIONS)[number];

const CUSTOM_FONT_REF_RE = /^([a-f0-9]{64})(?:\.(woff2|woff|ttf|otf))?$/i;

export function isCustomFontRef(value: string | null | undefined) {
  return !!value?.startsWith(CUSTOM_FONT_PREFIX);
}

export function parseCustomFontRef(value: string | null | undefined) {
  if (!value || !isCustomFontRef(value)) return null;
  const rest = value.slice(CUSTOM_FONT_PREFIX.length);
  const match = CUSTOM_FONT_REF_RE.exec(rest);
  if (!match) return null;
  return {
    hash: match[1],
    ext: (match[2]?.toLowerCase() ?? "woff2") as CustomFontExt,
  };
}

export function parseCustomFontHash(value: string | null | undefined) {
  return parseCustomFontRef(value)?.hash ?? null;
}

export function formatCustomFontRef(hash: string, ext: CustomFontExt = "woff2") {
  return `${CUSTOM_FONT_PREFIX}${hash}.${ext}`;
}

export function getCustomFontCssFamily(hash: string) {
  return `MutualzzFont-${hash.slice(0, 16)}`;
}

export type ParsedFontFamily =
  | { type: "custom"; hash: string; ref: string }
  | { type: "web"; family: string };

export function parseFontFamily(
  value: string | null | undefined,
): ParsedFontFamily | null {
  if (!value) return null;

  const customHash = parseCustomFontHash(value);
  if (customHash) {
    return { type: "custom", hash: customHash, ref: value };
  }

  return { type: "web", family: value };
}
