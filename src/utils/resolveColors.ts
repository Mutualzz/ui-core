import type { Theme } from "@emotion/react";
import { type Color, type ColorLike, type TypographyColor } from "@ui-types";
import { formatHex } from "culori";
import { useTheme } from "../hooks/useTheme";

export const isThemeColor = (
    color: Color | ColorLike | TypographyColor,
): color is Color => {
    return (
        typeof color === "string" &&
        ["primary", "neutral", "success", "danger", "warning", "info"].includes(
            color,
        )
    );
};

export const isTypographyColor = (
    color: Color | TypographyColor | ColorLike,
): color is TypographyColor => {
    return (
        typeof color === "string" &&
        ["primary", "secondary", "accent", "muted"].includes(color)
    );
};

export const resolveColor = (color: Color | ColorLike, theme: Theme) =>
    isThemeColor(color) ? theme.colors[color] : color;

export const useResolvedColor = (color: Color | ColorLike) => {
    const { theme } = useTheme();
    return resolveColor(color, theme);
};

export const resolveTypographyColor = (
    color: TypographyColor | ColorLike,
    theme: Theme,
) => (isTypographyColor(color) ? theme.typography.colors[color] : color);

export const useResolvedTypographyColor = (
    color: TypographyColor | ColorLike,
): TypographyColor | ColorLike => {
    const { theme } = useTheme();
    return resolveTypographyColor(color, theme);
};

export const resolveColorFromLuminance = (
    luminance: number | null,
    theme: Theme,
) => {
    if (!luminance) return theme.typography.colors.muted;

    return formatHex(
        luminance < 0.5 ? theme.colors.common.white : theme.colors.common.black,
    ) as ColorLike;
};
