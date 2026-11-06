import type { Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    ThemeVarColor,
    TypographyColor,
} from "@ui-types";
import { isValidColorInput } from "./colorRegex";
import {
    isThemeColor,
    isTypographyColor,
    resolveColor,
    resolveTypographyColor,
} from "./resolveColors";
import { createColor, formatColor } from "./colorUtils";

const themeColors = [
    "primary",
    "neutral",
    "success",
    "danger",
    "warning",
    "info",
] as const;

const typographyColors = ["primary", "secondary", "accent", "muted"] as const;

const onColor = (theme: Theme, background: ColorLike) =>
    formatColor(theme.typography.colors.primary, {
        negate: createColor(background).isLight(),
    });

const contrastColor = (theme: Theme, background: ColorLike) =>
    createColor(background).isDark()
        ? formatColor(theme.typography.colors.primary)
        : formatColor(background, { darken: 70 });

export const themeToCssVars = (theme: Theme) => {
    const vars: Record<string, string> = {};

    for (const name of themeColors) {
        vars[`--mz-${name}`] = formatColor(theme.colors[name]);
        vars[`--mz-on-${name}`] = onColor(theme, theme.colors[name]);
        vars[`--mz-contrast-${name}`] = contrastColor(
            theme,
            theme.colors[name],
        );
    }

    const text = theme.typography.colors.primary;
    vars["--mz-text"] = formatColor(text);
    vars["--mz-on-text"] = onColor(theme, text);
    vars["--mz-contrast-text"] = contrastColor(theme, text);

    for (const name of typographyColors) {
        vars[`--mz-typography-${name}`] = formatColor(
            theme.typography.colors[name],
        );
    }

    vars["--mz-background"] = String(theme.colors.background);

    return vars;
};

export const typographyColorVar = (color: (typeof typographyColors)[number]) =>
    `var(--mz-typography-${color})`;

export const themeBackgroundVar = () => "var(--mz-background)";

export const resolveTextColorToken = (
    textColor: TypographyColor | ColorLike | "inherit",
    theme: Theme,
): string => {
    if (textColor === "inherit") return typographyColorVar("primary");
    if (isTypographyColor(textColor)) return typographyColorVar(textColor);

    const parsed = resolveTypographyColor(textColor, theme);
    return isValidColorInput(parsed) ? parsed : typographyColorVar("primary");
};

export const isThemeVarColor = (color: unknown): color is ThemeVarColor =>
    color === "text" ||
    (typeof color === "string" && isThemeColor(color as Color));

export const resolveTextColorAlias = <T extends string>(
    color: T | "text",
    theme: Theme,
): Exclude<T, "text"> | ColorLike =>
    color === "text"
        ? theme.typography.colors.primary
        : (color as Exclude<T, "text">);

export const themeColorVar = (color: ThemeVarColor) => `var(--mz-${color})`;

export const themeOnColorVar = (color: ThemeVarColor) =>
    `var(--mz-on-${color})`;

export const mixTransparent = (color: string, percent: number) =>
    `color-mix(in srgb, ${color} ${percent}%, transparent)`;

export interface ColorTokens {
    base: string;
    on: string;
    contrast: string;
    alpha: (percent: number) => string;
}

export const resolveColorTokens = (
    color: ThemeVarColor | ColorLike,
    theme: Theme,
): ColorTokens => {
    if (isThemeVarColor(color)) {
        const base = themeColorVar(color);
        return {
            base,
            on: themeOnColorVar(color),
            contrast: `var(--mz-contrast-${color})`,
            alpha: (percent) => mixTransparent(base, percent),
        };
    }

    const resolved = resolveColor(color, theme);
    return {
        base: formatColor(resolved),
        get on() {
            return onColor(theme, resolved);
        },
        get contrast() {
            return contrastColor(theme, resolved);
        },
        alpha: (percent) =>
            formatColor(resolved, { alpha: percent, format: "hexa" }),
    };
};
