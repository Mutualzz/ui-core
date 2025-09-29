import type { ColorLike } from "@ui-types";
import Color from "color";

// Helper to trim and remove trailing semicolon
const cleanInput = (raw: string) =>
    raw
        .trim()
        .replace(/^['"]|['"]$/g, "")
        .replace(/;+$/, "")
        .replace(/\s+/g, " ");

const BYTE = "(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)"; // 0–255
const PCT = "(?:100(?:\\.0+)?|\\d?\\d(?:\\.\\d+)?)%"; // 0%–100%
const ALPHA_STRICT = `(?:0|1|0?\\.\\d+|${PCT})`; // 0–1 or percent
const HUE = "(?:360(?:\\.0+)?|\\d?\\d?\\d(?:\\.\\d+)?)"; // 0–360 (no units)

// Hex Regex
export const hexRegex = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

// RGB Regex
export const rgbStrictRegex = new RegExp(
    String.raw`^rgba?\(\s*(?:` +
        String.raw`(${BYTE})\s*,\s*(${BYTE})\s*,\s*(${BYTE})(?:\s*,\s*(${ALPHA_STRICT}))?` +
        String.raw`|` +
        String.raw`${BYTE}\s+${BYTE}\s+${BYTE}(?:\s*/\s*${ALPHA_STRICT})?` +
        String.raw`)\s*\)$`,
    "i",
);

// hsl Regex
export const hslStrictRegex = new RegExp(
    String.raw`^hsla?\(\s*(?:` +
        String.raw`(${HUE})\s*,\s*(${PCT})\s*,\s*(${PCT})(?:\s*,\s*(${ALPHA_STRICT}))?` +
        String.raw`|` +
        String.raw`${HUE}\s+${PCT}\s+${PCT}(?:\s*/\s*${ALPHA_STRICT})?` +
        String.raw`)\s*\)$`,
    "i",
);

// More permissive regex patterns (loose) for rgb/rgba
export const rgbLooseRegex =
    /^rgba?\(\s*(?:\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*(?:\d*\.?\d+|\d+%))?|(?:\d+\s+){2}\d+(?:\s*\/\s*(?:\d*\.?\d+|\d+%))?)\s*\)$/i;

// More permissive regex patterns (loose) for hsl/hsla
export const hslLooseRegex =
    /^hsla?\(\s*(?:-?\d*\.?\d+\s*,\s*\d*\.?\d+%\s*,\s*\d*\.?\d+%(?:\s*,\s*(?:\d*\.?\d+|\d+%))?| -?\d*\.?\d+\s+\d*\.?\d+%\s+\d*\.?\d+%(?:\s*\/\s*(?:\d*\.?\d+|\d+%))?)\s*\)$/i;

// Use strict versions by default
export const cssVarRegex = /^var\(\s*--[A-Za-z0-9-_]+\s*(?:,\s*[^)]+)?\)$/;
export const gradientRegex =
    /^(repeating-)?(linear|radial|conic)-gradient\((.+)\)$/i;

// Helpers
export const isValidHex = (v: ColorLike) => hexRegex.test(cleanInput(v));
export const isValidCssVar = (v: string) => cssVarRegex.test(cleanInput(v));
export const isValidGradient = (v: string) => gradientRegex.test(cleanInput(v));
export const isRgbStrict = (v: string) => rgbStrictRegex.test(cleanInput(v));
export const isHslStrict = (v: string) => hslStrictRegex.test(cleanInput(v));
export const isRgbLoose = (v: string) => rgbLooseRegex.test(cleanInput(v));
export const isHslLoose = (v: string) => hslLooseRegex.test(cleanInput(v));

type Mode = "strict" | "loose";

export const isValidColorInput = (value: string, mode: Mode = "strict") => {
    const str = cleanInput(value) as ColorLike;

    if (isValidCssVar(str) || isValidGradient(str)) return true;

    const fastOk =
        isValidHex(str) ||
        (mode === "strict"
            ? isRgbStrict(str) || isHslStrict(str)
            : isRgbLoose(str) || isHslLoose(str));

    if (fastOk) return true;

    try {
        new Color(str);
        return true;
    } catch {
        return false;
    }
};

export const normalizeColor = (value: string): string | null => {
    const s = cleanInput(value);

    if (isValidCssVar(s) || isValidGradient(s)) return null;

    try {
        const c = new Color(s);
        return c.alpha() === 1 ? c.rgb().string() : c.rgb().string();
    } catch {
        return null;
    }
};
