import type { Shape, SizeValue, TypographyLevelObj } from "@ui-types";

export const getScrollableAncestors = (
    node: HTMLElement | null,
): (HTMLElement | Window)[] => {
    const ancestors: (HTMLElement | Window)[] = [window];
    let current = node?.parentElement;
    while (current) {
        const style = getComputedStyle(current);
        if (
            /(auto|scroll)/.test(
                style.overflow + style.overflowY + style.overflowX,
            )
        ) {
            ancestors.push(current);
        }
        current = current.parentElement;
    }
    return ancestors;
};

export const snap = (v: number, step = 0.1) => Math.round(v / step) * step;

export const normalizeTypography = (level: TypographyLevelObj) => {
    const { fontSize } = level;

    const lineHeight =
        typeof level.lineHeight === "number" &&
        level.lineHeight > 0 &&
        level.lineHeight < 4
            ? Math.round(fontSize * level.lineHeight)
            : Number(level.lineHeight);

    const letterSpacing =
        typeof level.letterSpacing === "string"
            ? fontSize * parseFloat(level.letterSpacing)
            : level.letterSpacing;

    const fontWeight =
        typeof level.fontWeight === "string"
            ? String(level.fontWeight)
            : level.fontWeight;

    return {
        ...level,
        lineHeight,
        letterSpacing,
        fontWeight,
    };
};

export const allowedListStyleTypes = [
    "disc",
    "circle",
    "square",
    "decimal",
    "decimal-leading-zero",
    "lower-roman",
    "upper-roman",
    "lower-alpha",
    "upper-alpha",
    "lower-latin",
    "upper-latin",
    "armenian",
    "georgian",
    "lower-greek",
    "lower-armenian",
    "upper-armenian",
    "hebrew",
    "cjk-earthly-branch",
    "cjk-heavenly-stem",
    "hiragana",
    "hiragana-iroha",
    "katakana",
    "katakana-iroha",
    "japanese-formal",
    "japanese-informal",
    "korean-hangul-formal",
    "korean-hanja-formal",
    "korean-hanja-informal",
    "simp-chinese-formal",
    "simp-chinese-informal",
    "trad-chinese-formal",
    "trad-chinese-informal",
    "disclosure-open",
    "disclosure-closed",
    "none",
] as const;

export const isCssMarker = (
    marker: any,
): marker is (typeof allowedListStyleTypes)[number] => {
    return allowedListStyleTypes.includes(marker);
};

export const resolveShapeValue = (shape: Shape | SizeValue | number) => {
    let resolvedRadius;
    switch (shape) {
        case "circle":
            resolvedRadius = 9999;
            break;
        case "rounded":
            resolvedRadius = 8;
            break;
        case "square":
            resolvedRadius = 0;
            break;
        default:
            resolvedRadius = shape;
            break;
    }

    return resolvedRadius;
};

export * from "./colorRegex";
export * from "./colorUtils";
export * from "./getReactElementRef";
export * from "./getRelativePosition";
export * from "./number";
export * from "./randomColor";
export * from "./resolveColors";
export * from "./resolveSize";
export * from "./responsive";
export * from "./setRef";
export * from "./spacing";
export * from "./touch";
export * from "./visuallyHidden";
