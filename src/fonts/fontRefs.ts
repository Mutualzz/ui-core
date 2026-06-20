export const CUSTOM_FONT_PREFIX = "font:" as const;

const CUSTOM_FONT_HASH_RE = /^[a-f0-9]{64}$/i;

export function isCustomFontRef(value: string | null | undefined) {
  return !!value?.startsWith(CUSTOM_FONT_PREFIX);
}

export function parseCustomFontHash(value: string | null | undefined) {
  if (!value || !isCustomFontRef(value)) return null;
  const hash = value.slice(CUSTOM_FONT_PREFIX.length);
  return CUSTOM_FONT_HASH_RE.test(hash) ? hash : null;
}

export function formatCustomFontRef(hash: string) {
  return `${CUSTOM_FONT_PREFIX}${hash}`;
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
