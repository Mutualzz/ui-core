import { formatColor } from "./colorUtils";

export const PROFILE_BLOCK_BORDER_WIDTH_MAX = 8;
export const PROFILE_BLOCK_OPACITY_MIN = 20;
export const PROFILE_BLOCK_OPACITY_MAX = 100;
export const PROFILE_BLOCK_BLUR_MAX = 20;
export const PROFILE_BLOCK_PADDING_MAX = 32;

const PADDED_BLOCK_TYPES = new Set([
    "text",
    "quote",
    "links",
    "activity",
    "roles",
    "connections",
    "mutual",
]);

const TEXT_ALIGNED_BLOCK_TYPES = new Set(["text", "quote"]);

export const supportsProfileBlockPadding = (type: string) =>
    PADDED_BLOCK_TYPES.has(type);

export const supportsProfileBlockTextAlign = (type: string) =>
    TEXT_ALIGNED_BLOCK_TYPES.has(type);

const FONTLESS_BLOCK_TYPES = new Set([
    "image",
    "sticker",
    "draw",
    "divider",
    "gallery",
    "embed",
]);

export const supportsProfileBlockFont = (type: string) =>
    !FONTLESS_BLOCK_TYPES.has(type);

export interface ProfileBlockAppearanceInput {
    borderWidth?: number | null;
    borderStyle?: string | null;
    borderColor?: string | null;
    shadow?: string | null;
    shadowColor?: string | null;
    opacity?: number | null;
    blur?: number | null;
    padding?: number | null;
    textAlign?: string | null;
}

export interface ProfileBlockAppearanceStyle {
    border?: string;
    boxShadow?: string;
    opacity?: number;
    backdropFilter?: string;
    glass: boolean;
    padding?: number;
    textAlign?: string;
}

const SHADOW_PRESETS: Record<
    string,
    { offsetY: number; blur: number; spread: number; alpha: number }
> = {
    soft: { offsetY: 4, blur: 16, spread: 0, alpha: 35 },
    strong: { offsetY: 10, blur: 32, spread: 0, alpha: 55 },
    glow: { offsetY: 0, blur: 18, spread: 2, alpha: 80 },
};

const clampNumber = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

export const getProfileBlockAppearanceStyle = (
    appearance: ProfileBlockAppearanceInput | null | undefined,
    fallbackColor = "#000000",
): ProfileBlockAppearanceStyle => {
    if (!appearance) return { glass: false };

    const style: ProfileBlockAppearanceStyle = { glass: false };

    const borderWidth = clampNumber(
        Math.round(appearance.borderWidth ?? 0),
        0,
        PROFILE_BLOCK_BORDER_WIDTH_MAX,
    );
    if (borderWidth > 0) {
        style.border = `${borderWidth}px ${appearance.borderStyle ?? "solid"} ${
            appearance.borderColor || fallbackColor
        }`;
    }

    const shadowPreset = appearance.shadow
        ? SHADOW_PRESETS[appearance.shadow]
        : undefined;
    if (shadowPreset) {
        const shadowColor = formatColor(appearance.shadowColor || "#000000", {
            alpha: shadowPreset.alpha,
            format: "hexa",
        });
        style.boxShadow = `0 ${shadowPreset.offsetY}px ${shadowPreset.blur}px ${shadowPreset.spread}px ${shadowColor}`;
    }

    if (appearance.opacity != null && appearance.opacity < 100) {
        style.opacity =
            clampNumber(
                appearance.opacity,
                PROFILE_BLOCK_OPACITY_MIN,
                PROFILE_BLOCK_OPACITY_MAX,
            ) / 100;
    }

    const blur = clampNumber(
        Math.round(appearance.blur ?? 0),
        0,
        PROFILE_BLOCK_BLUR_MAX,
    );
    if (blur > 0) {
        style.backdropFilter = `blur(${blur}px) saturate(1.2)`;
        style.glass = true;
    }

    if (appearance.padding != null) {
        style.padding = clampNumber(
            Math.round(appearance.padding),
            0,
            PROFILE_BLOCK_PADDING_MAX,
        );
    }

    if (appearance.textAlign) style.textAlign = appearance.textAlign;

    return style;
};
