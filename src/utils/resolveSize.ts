import type { Theme } from "@emotion/react";
import type { Size, SizeValue } from "@ui-types";

export const cssUnitRegex =
    /^(-?\d*\.?\d+)(px|rem|em|%|vh|vw|vmin|vmax|pt|fr)$/i;

export const isSizeValue = (
    size: Size | SizeValue | number,
): size is SizeValue => {
    return typeof size === "string" && cssUnitRegex.test(size);
};

export const isSize = (
    size: Size | SizeValue | number,
    map: Record<Size, string | number>,
): size is Size => {
    return typeof size === "string" && size in map;
};

export const isNumberSize = (
    size: Size | SizeValue | number,
): size is number => {
    return typeof size === "number";
};

export const resolveSize = (
    theme: Theme,
    size: Size | SizeValue | number,
    map: Record<Size, number>,
) => {
    // If size is just a number, return it directly
    if (isNumberSize(size)) return size;

    // If size is a theme size (sm, md, lg), resolve it from the map (if available)
    if (isSize(size, map) && size in map) return map[size];

    if (isSizeValue(size)) {
        const match = size.match(cssUnitRegex);
        if (!match) return map.md; // Default to medium size if no match

        const [, numStr, unit] = match;
        const value = parseFloat(numStr);
        if (isNaN(value)) return map.md; // Default to medium size if NaN

        switch (unit) {
            case "px":
                return value; // Return as is for pixels
            case "rem":
            case "em":
                return value * theme.typography.levels["body-md"].fontSize;
            case "%":
                return (value / 100) * 1.333;
            default:
                return map.md; // Default to medium size for unsupported units
        }
    }

    return map.md; // Default to medium size if nothing matches
};
