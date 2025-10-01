import type { Theme } from "@emotion/react";
import { type Color, type ColorLike, type TypographyColor } from "@ui-types";
import type { ColorInstance } from "color";
import { formatColor } from "./colorUtils";

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

export const resolveTypographyColor = (
    color: TypographyColor | ColorLike,
    theme: Theme,
) => (isTypographyColor(color) ? theme.typography.colors[color] : color);

export const resolveColorFromLuminance = (
    color: ColorInstance,
    theme: Theme,
) => {
    const luminance = color.luminosity() * 100;

    return formatColor(
        luminance < 0.5 ? theme.colors.common.white : theme.colors.common.black,
        { format: "hexa" },
    );
};
