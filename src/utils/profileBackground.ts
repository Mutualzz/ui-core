import type { ColorLike } from "../types";
import { isValidGradient } from "./colorRegex";
import { extractGradientInfo } from "./colorUtils";

export const PROFILE_BACKGROUND_GRADIENT_ANGLE = 160;

export function resolveProfileBackgroundFill(
    backgroundColor: string | null | undefined,
    fallback: string,
): string {
    return backgroundColor?.trim() || fallback;
}

export function buildProfileBackgroundCss(options: {
    backgroundColor?: string | null;
    backgroundImageUrl?: string | null;
    fallback: string;
}): string {
    const fill = resolveProfileBackgroundFill(
        options.backgroundColor,
        options.fallback,
    );

    if (options.backgroundImageUrl) {
        return `url("${options.backgroundImageUrl}") center / cover no-repeat, ${fill}`;
    }

    return fill;
}

export function parseProfileBackgroundColors(
    backgroundColor: string | null | undefined,
): { start: string; end: string | null } {
    const value = backgroundColor?.trim();
    if (!value) {
        return { start: "#1a1a2e", end: null };
    }

    if (isValidGradient(value)) {
        const info = extractGradientInfo(value as ColorLike);
        if (info && info.colors.length >= 2) {
            return {
                start: String(info.colors[0]),
                end: String(info.colors[info.colors.length - 1]),
            };
        }
    }

    return { start: value, end: null };
}

export function buildProfileBackgroundColor(
    start: string | null | undefined,
    end: string | null | undefined,
): string | null {
    const primary = start?.trim();
    const secondary = end?.trim();

    if (!primary) return null;
    if (!secondary || secondary.toLowerCase() === primary.toLowerCase()) {
        return primary;
    }

    return `linear-gradient(${PROFILE_BACKGROUND_GRADIENT_ANGLE}deg, ${primary}, ${secondary})`;
}

export function isProfileBackgroundGradient(
    backgroundColor: string | null | undefined,
): boolean {
    return Boolean(backgroundColor && isValidGradient(backgroundColor));
}
