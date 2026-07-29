import type { Theme } from "@emotion/react";
import type { ColorLike, Variant } from "@ui-types";
import { isValidGradient } from "./colorRegex";
import { extractColors, formatColor } from "./colorUtils";
import { hasWallpaper, type WallpaperSurfaceRole } from "./wallpaper";

export type OverlaySurfaceRole =
    | "tooltip"
    | "menu"
    | "popover"
    | "modal"
    | "toolbar";

export type SurfaceRole = WallpaperSurfaceRole | OverlaySurfaceRole;

export type PaperVariant = Variant | "elevation";

const OVERLAY_OPACITY: Record<OverlaySurfaceRole, number> = {
    tooltip: 92,
    menu: 95,
    popover: 88,
    modal: 97,
    toolbar: 90,
};

const VARIANT_OPACITY: Record<PaperVariant, number> = {
    solid: 100,
    elevation: 95,
    outlined: 92,
    plain: 88,
    soft: 10,
};

export function isGradientTheme(theme: Theme): boolean {
    return (
        isValidGradient(theme.colors.surface) ||
        isValidGradient(theme.colors.background)
    );
}

export function isOverlaySurfaceRole(
    role: SurfaceRole,
): role is OverlaySurfaceRole {
    return role in OVERLAY_OPACITY;
}

export function isWallpaperSurfaceRole(
    role: SurfaceRole,
): role is WallpaperSurfaceRole {
    return !isOverlaySurfaceRole(role);
}

export function resolveSurfaceOpacity(
    theme: Theme,
    variant: PaperVariant,
    elevation: number,
    surfaceRole?: SurfaceRole,
): number {
    if (variant === "solid") return 100;
    if (variant === "soft") return VARIANT_OPACITY.soft;

    if (elevation === 0 && (variant === "outlined" || variant === "plain")) {
        return 0;
    }

    if (!isGradientTheme(theme) && !hasWallpaper(theme)) {
        return 100;
    }

    if (surfaceRole && isOverlaySurfaceRole(surfaceRole)) {
        return OVERLAY_OPACITY[surfaceRole];
    }

    return VARIANT_OPACITY[variant];
}

export function resolveOpaqueSurfaceBase(
    theme: Theme,
    elevatedColor: ColorLike,
): ColorLike {
    if (!isValidGradient(theme.colors.background)) {
        return formatColor(theme.colors.background, { format: "hexa" });
    }

    const backgroundStops = extractColors(theme.colors.background);
    if (backgroundStops?.[0]) {
        return formatColor(backgroundStops[0], { format: "hexa" });
    }

    const elevatedStops = extractColors(elevatedColor);
    if (elevatedStops?.[0]) {
        return formatColor(elevatedStops[0], { format: "hexa" });
    }

    return formatColor(theme.colors.neutral, { format: "hexa" });
}

export interface PanelFillStyles {
    background?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundRepeat?: string;
    backgroundSize?: string;
}

export function resolvePanelFill(
    theme: Theme,
    elevatedColor: ColorLike,
    variant: PaperVariant,
    elevation: number,
    surfaceRole?: SurfaceRole,
): PanelFillStyles {
    if (elevation === 0 && (variant === "outlined" || variant === "plain")) {
        return { background: "transparent" };
    }

    const opacity = resolveSurfaceOpacity(
        theme,
        variant,
        elevation,
        surfaceRole,
    );

    if (opacity >= 100) {
        if (isValidGradient(elevatedColor)) {
            return { background: elevatedColor };
        }

        return {
            background: formatColor(elevatedColor),
        };
    }

    const tinted = formatColor(elevatedColor, {
        alpha: opacity,
        format: "hexa",
    }) as string;

    if (isValidGradient(elevatedColor)) {
        return {
            backgroundColor: resolveOpaqueSurfaceBase(
                theme,
                elevatedColor,
            ),
            backgroundImage: tinted,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
        };
    }

    return { background: tinted };
}
