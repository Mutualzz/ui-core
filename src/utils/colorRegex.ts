import { parse } from "culori";

// Helper to trim and remove trailing semicolon
const cleanInput = (value: string) => value.trim().replace(/;$/, "");

// Regex patterns
export const hexRegex = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
export const rgbRegex = /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/;
export const rgbaRegex =
    /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0|1|0?\.\d+)\s*\)$/;
export const hslRegex = /^hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)$/;
export const hslaRegex =
    /^hsla\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*,\s*(0|1|0?\.\d+)\s*\)$/;
export const linearGradientRegex = /^linear-gradient\((.+)\)$/i;
export const radialGradientRegex = /^radial-gradient\((.+)\)$/i;
export const conicGradientRegex = /^conic-gradient\((.+)\)$/i;
export const gradientRegex = /^(linear|radial|conic)-gradient\((.+)\)$/i;

/**
 * Checks if the input is a valid hex color.
 */
export const isValidHex = (value: string): boolean =>
    hexRegex.test(cleanInput(value));

/**
 * Checks if the input is a valid RGB color.
 * RGB format: rgb(r, g, b)
 * where r, g, b are integers between 0 and 255.
 */
export const isValidRgb = (value: string): boolean =>
    rgbRegex.test(cleanInput(value));

/**
 * Checks if the input is a valid RGBA color.
 * RGBA format: rgba(r, g, b, a)
 * where r, g, b are integers between 0 and 255,
 * and a is a number between 0 and 1 (inclusive).
 */
export const isValidRgba = (value: string): boolean =>
    rgbaRegex.test(cleanInput(value));

/**
 * Checks if the input is a valid HSL color.
 * HSL format: hsl(h, s%, l%)
 * where h is an integer between 0 and 360,
 * s and l are percentages between 0% and 100%.
 */
export const isValidHsl = (value: string): boolean =>
    hslRegex.test(cleanInput(value));

/**
 * Checks if the input is a valid HSLA color.
 * HSLA format: hsla(h, s%, l%, a)
 * where h is an integer between 0 and 360,
 * s and l are percentages between 0% and 100%,
 * and a is a number between 0 and 1 (inclusive).
 */
export const isValidHsla = (value: string): boolean =>
    hslaRegex.test(cleanInput(value));

export const isValidLinearGradient = (value: string): boolean =>
    linearGradientRegex.test(cleanInput(value));

/**
 * Checks if the input is a valid radial-gradient string.
 */
export const isValidRadialGradient = (value: string): boolean =>
    radialGradientRegex.test(cleanInput(value));

/**
 * Checks if the input is a valid conic-gradient string.
 */
export const isValidConicGradient = (value: string): boolean =>
    conicGradientRegex.test(cleanInput(value));

export const isValidGradient = (value: string): boolean =>
    gradientRegex.test(cleanInput(value));

/**
 * Checks if the input is a valid color input.
 * It checks for valid hex, rgb, rgba, hsl, and hsla formats.
 * Returns true if the input is valid, false otherwise.
 */
export const isValidColorInput = (value: string): boolean => {
    // First check the existing regex patterns for performance
    const trimmed = cleanInput(value);

    if (isValidGradient(trimmed)) return true;

    const isValidFormat =
        isValidHex(trimmed) ||
        isValidRgb(trimmed) ||
        isValidRgba(trimmed) ||
        isValidHsl(trimmed) ||
        isValidHsla(trimmed);

    if (isValidFormat) return true;

    // If regex patterns don't match, use culori to check for named colors
    // and other valid CSS color formats
    const parsed = parse(trimmed);
    return parsed !== undefined;
};
