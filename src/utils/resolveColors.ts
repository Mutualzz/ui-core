import type { Theme } from "@emotion/react";
import { type Color, type ColorLike, type TypographyColor } from "@ui-types";

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
): color is Exclude<TypographyColor, "transparent" | "inherit"> => {
    return (
        typeof color === "string" &&
        ["primary", "secondary", "accent", "muted"].includes(color)
    );
};

export const resolveColor = (color: Color | ColorLike, theme: Theme) =>
    isThemeColor(color) ? theme.colors[color] : color;

export const resolveTypographyColor = (
    color: TypographyColor | ColorLike,
    theme: Theme,
) => (isTypographyColor(color) ? theme.typography.colors[color] : color);
