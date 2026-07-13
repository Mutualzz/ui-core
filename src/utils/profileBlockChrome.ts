export const PROFILE_BLOCK_CORNER_RADIUS_MIN = 0;
export const PROFILE_BLOCK_CORNER_RADIUS_MAX = 48;
export const PROFILE_BLOCK_CORNER_RADIUS_DEFAULT = 8;
export const PROFILE_MOBILE_WIDGET_CORNER_RADIUS_DEFAULT = 12;
export const PROFILE_DIVIDER_CORNER_RADIUS_DEFAULT = 0;

export type ProfileBlockChromePlatform = "desktop" | "mobile";

export function clampProfileBlockCornerRadius(value: number): number {
  return Math.round(
    Math.min(
      PROFILE_BLOCK_CORNER_RADIUS_MAX,
      Math.max(PROFILE_BLOCK_CORNER_RADIUS_MIN, value),
    ),
  );
}

export function resolveProfileBlockCornerRadius(
  block: { type: string; cornerRadius?: number | null },
  platform: ProfileBlockChromePlatform = "desktop",
): number {
  if (block.cornerRadius != null) {
    return clampProfileBlockCornerRadius(block.cornerRadius);
  }

  if (block.type === "divider") {
    return PROFILE_DIVIDER_CORNER_RADIUS_DEFAULT;
  }

  return platform === "mobile"
    ? PROFILE_MOBILE_WIDGET_CORNER_RADIUS_DEFAULT
    : PROFILE_BLOCK_CORNER_RADIUS_DEFAULT;
}

export function isCustomProfileBlockCornerRadius(
  block: { cornerRadius?: number | null },
): boolean {
  return block.cornerRadius != null;
}

export function resolveProfileBlockBackgroundColor(
  block: { backgroundColor?: string | null },
): string | null {
  const value = block.backgroundColor?.trim();
  return value || null;
}

export function supportsProfileBlockBackgroundColor(type: string): boolean {
  return type !== "divider" && type !== "draw";
}
