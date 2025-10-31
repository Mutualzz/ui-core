import type {
    ColorFormat,
    ColorLike,
    Hex,
    HSL,
    HSLA,
    HSV,
    HSVA,
    RGB,
    RGBA,
} from "@ui-types";

/**
 * Generate a random hex color
 * @param alpha - Alpha value between 0 and 1 (optional)
 * @returns {Hex} Random hex color
 */
export const randomHexColor = (alpha?: number): Hex => {
    const array = new Uint8Array(3);
    crypto.getRandomValues(array);

    let hex: Hex = `#${Array.from(array.slice(0, 3))
        .map((byte) => byte.toString(16).padStart(2, "0").toUpperCase())
        .join("")}`;

    if (alpha && alpha !== 100) {
        // Clamp alpha between 0 and 1
        const clampedAlpha = Math.max(0, Math.min(1, alpha));
        // Convert to 0-255 range and add to hex
        const alphaHex = Math.round(clampedAlpha * 255)
            .toString(16)
            .padStart(2, "0")
            .toUpperCase();

        hex = `${hex}${alphaHex}` as Hex;
    }

    return hex;
};

/**
 * Generate a random HSV color
 * @param alpha - Alpha value between 0 and 1 (optional)
 * @returns {HSV | HSVA} Random HSV color
 */
export const randomHsvColor = (alpha?: number): HSV | HSVA => {
    const array = new Uint8Array(3);
    crypto.getRandomValues(array);

    // Hue: 0-360 degrees
    const h = Math.round((array[0] / 255) * 360);
    // Saturation: 20-100% (avoid too desaturated colors)
    const s = Math.round(20 + (array[1] / 255) * 80);
    // Value/Brightness: 20-100% (avoid too dark colors)
    const v = Math.round(20 + (array[2] / 255) * 80);

    if (alpha && alpha !== 100) {
        const clampedAlpha = Math.max(0, Math.min(1, alpha));
        return `hsva(${h}, ${s}%, ${v}%, ${clampedAlpha})`;
    }

    return `hsv(${h}, ${s}%, ${v}%)`;
};

/**
 * Generate a random RGB color
 * @param alpha - Alpha value between 0 and 1 (optional)
 * @returns {RGB | RGBA} Random RGB color
 */
export const randomRgbColor = (alpha?: number): RGB | RGBA => {
    const array = new Uint8Array(3);
    crypto.getRandomValues(array);

    const [r, g, b] = Array.from(array);

    if (alpha && alpha !== 100) {
        const clampedAlpha = Math.max(0, Math.min(1, alpha));
        return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
    }

    return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Generate a random HSL color
 * @param alpha - Alpha value between 0 and 1 (optional)
 * @returns {HSL | HSLA} Random HSL color
 */
export const randomHslColor = (alpha?: number): HSL | HSLA => {
    const array = new Uint8Array(3);
    crypto.getRandomValues(array);

    // Hue: 0-360 degrees
    const h = Math.round((array[0] / 255) * 360);
    // Saturation: 20-100% (avoid too desaturated colors)
    const s = Math.round(20 + (array[1] / 255) * 80);
    // Lightness: 20-80% (avoid too dark/light colors)
    const l = Math.round(20 + (array[2] / 255) * 60);

    if (alpha && alpha !== 100) {
        const clampedAlpha = Math.max(0, Math.min(1, alpha));
        return `hsla(${h}, ${s}%, ${l}%, ${clampedAlpha})`;
    }

    return `hsl(${h}, ${s}%, ${l}%)`;
};

/**
 * Generate a random linear gradient
 * @returns {ColorLike} Random linear-gradient CSS string
 */
export const randomLinearGradient = (): ColorLike => {
    // Generate two random colors
    const color1 = randomHexColor();
    const color2 = randomHexColor();
    // Random angle (0-360deg)
    const angle = Math.floor(Math.random() * 361);
    return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
};

/**
 * Generate a random radial gradient
 * @returns {ColorLike} Random radial-gradient CSS string
 */
export const randomRadialGradient = (): ColorLike => {
    const color1 = randomHexColor();
    const color2 = randomHexColor();
    return `radial-gradient(circle, ${color1}, ${color2})`;
};

/**
 * Generate a random conic gradient
 * @returns {ColorLike} Random conic-gradient CSS string
 */
export const randomConicGradient = (): ColorLike => {
    const color1 = randomHexColor();
    const color2 = randomHexColor();
    const angle = Math.floor(Math.random() * 361);
    return `conic-gradient(from ${angle}deg, ${color1}, ${color2})`;
};

/**
 * Generate a random gradient in the specified format
 * @param type - The gradient type to generate
 * @returns Gradient string in the specified format
 */
export const randomGradient = (
    type: "linear" | "radial" | "conic" = "linear",
): ColorLike => {
    switch (type) {
        case "linear":
            return randomLinearGradient();
        case "radial":
            return randomRadialGradient();
        case "conic":
            return randomConicGradient();
        default:
            return randomLinearGradient();
    }
};

/**
 * Generate a random color in the specified format
 * @param format - The color format to generate
 * @param alpha - Alpha value between 0 and 1 (optional)
 * @returns Color string in the specified format
 */
export const randomColor = (
    type:
        | ColorFormat
        | "linear-gradient"
        | "radial-gradient"
        | "conic-gradient" = "hex",
    alpha?: number,
): ColorLike => {
    switch (type) {
        case "hex":
            return randomHexColor(alpha);
        case "rgb":
            return randomRgbColor(alpha);
        case "hsl":
            return randomHslColor(alpha);
        case "hsv":
            return randomHsvColor(alpha);
        case "linear-gradient":
            return randomLinearGradient();
        case "radial-gradient":
            return randomRadialGradient();
        case "conic-gradient":
            return randomConicGradient();
        default:
            return randomHexColor(alpha);
    }
};

/**
 * Generate a random alpha value between 0 and 1
 * @param min - Minimum alpha value (default: 0)
 * @param max - Maximum alpha value (default: 1)
 * @returns Random alpha value
 */
export const randomAlpha = (min = 0, max = 1): number => {
    const array = new Uint8Array(1);
    crypto.getRandomValues(array);

    const normalizedValue = array[0] / 255;
    const clampedMin = Math.max(0, Math.min(1, min));
    const clampedMax = Math.max(0, Math.min(1, max));

    return clampedMin + normalizedValue * (clampedMax - clampedMin);
};
