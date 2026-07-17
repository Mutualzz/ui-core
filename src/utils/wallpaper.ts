import type { Theme } from "@emotion/react";
import { formatColor } from "./colorUtils";
import { isValidGradient } from "./colorRegex";

export type WallpaperSurfaceRole =
    | "chrome"
    | "content"
    | "card"
    | "popout"
    | "composer";

export type ThemeWallpaper = {
    brightness?: number;
    saturation?: number;
    overlay?: number;
    chrome?: number;
    content?: number;
    card?: number;
    popout?: number;
    composer?: number;
    blur?: number;
};

export type ResolvedThemeWallpaper = {
    brightness: number;
    saturation: number;
    overlay: number;
    chrome: number;
    content: number;
    card: number;
    popout: number;
    composer: number;
    blur: number;
};

export const DEFAULT_WALLPAPER_DARK: ResolvedThemeWallpaper = {
    brightness: 102,
    saturation: 100,
    overlay: 28,
    chrome: 76,
    content: 54,
    card: 52,
    popout: 88,
    composer: 74,
    blur: 0,
};

export const DEFAULT_WALLPAPER_LIGHT: ResolvedThemeWallpaper = {
    brightness: 106,
    saturation: 100,
    overlay: 12,
    chrome: 80,
    content: 58,
    card: 56,
    popout: 92,
    composer: 78,
    blur: 0,
};

export function hasWallpaper(theme: Theme) {
    return Boolean(theme.backgroundImageUrl);
}

export function resolveWallpaperSettings(
    theme: Theme,
): ResolvedThemeWallpaper {
    return {
        ...(theme.type === "light"
            ? DEFAULT_WALLPAPER_LIGHT
            : DEFAULT_WALLPAPER_DARK),
    };
}

export function resolveWallpaperScrim(theme: Theme): string {
    const settings = resolveWallpaperSettings(theme);
    const base = isValidGradient(theme.colors.background)
        ? theme.colors.surface
        : theme.colors.background;

    return formatColor(base, {
        alpha: Math.round(settings.overlay * 0.55),
        format: "hexa",
    }) as string;
}

export function resolveWallpaperDimOverlay(theme: Theme): string {
    const settings = resolveWallpaperSettings(theme);
    const alpha = Math.min(Math.max((settings.overlay * 0.4) / 100, 0), 1);
    return theme.type === "light"
        ? `rgba(255, 255, 255, ${alpha})`
        : `rgba(0, 0, 0, ${alpha})`;
}

export function resolveWallpaperDivider(theme: Theme) {
    return formatColor(theme.colors.surface, {
        alpha: 22,
        format: "hexa",
    }) as string;
}

export function resolveWallpaperImageFilter(theme: Theme) {
    const settings = resolveWallpaperSettings(theme);
    return `brightness(${settings.brightness / 100}) saturate(${settings.saturation / 100})`;
}

export function resolveWallpaperSurfaceAlpha(
    theme: Theme,
    role: WallpaperSurfaceRole,
) {
    const settings = resolveWallpaperSettings(theme);
    return settings[role];
}

export function resolveWallpaperSurfaceStyles(
    theme: Theme,
    role: WallpaperSurfaceRole,
) {
    const settings = resolveWallpaperSettings(theme);
    const alpha = settings[role];

    return {
        background: formatColor(theme.colors.surface, {
            alpha,
            format: "hexa",
        }) as string,
        boxShadow:
            role === "popout" || role === "composer"
                ? "0 4px 18px rgba(0,0,0,0.22)"
                : "none",
    };
}

export function wallpaperBackgroundLayers(
    theme: Theme,
    imageUrl: string,
) {
    const dim = resolveWallpaperDimOverlay(theme);
    const scrim = resolveWallpaperScrim(theme);
    const filter = resolveWallpaperImageFilter(theme);
    const fallback = formatColor(
        isValidGradient(theme.colors.background)
            ? theme.colors.surface
            : theme.colors.background,
        { format: "hexa" },
    ) as string;

    return {
        backgroundColor: fallback,
        backgroundImage: `linear-gradient(${dim}, ${dim}), linear-gradient(${scrim}, ${scrim}), url(${imageUrl})`,
        backgroundSize: "cover, cover, cover",
        backgroundPosition: "center, center, center",
        backgroundRepeat: "no-repeat, no-repeat, no-repeat",
        isolation: "isolate" as const,
        ["--wallpaper-filter" as string]: filter,
    };
}
