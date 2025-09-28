import type { ColorLike } from "@ui-types";
import { rgb } from "culori";
import { isValidGradient } from "./colorRegex";
import { extractGradientStops } from "./gradients";

const toLuminance = (channel: number) =>
    channel <= 0.03928
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4);

export const getLuminance = (color: ColorLike): number | null => {
    const str = String(color).trim();

    if (isValidGradient(str)) {
        const stops = extractGradientStops(str);

        const luminances = stops
            .map((stop) => {
                const rgbColor = rgb(stop);
                if (!rgbColor) return null;
                const r = toLuminance(rgbColor.r);
                const g = toLuminance(rgbColor.g);
                const b = toLuminance(rgbColor.b);
                return 0.2126 * r + 0.7152 * g + 0.0722 * b;
            })
            .filter((lum): lum is number => lum !== null);

        // Return average luminance of stops, or 0 if none found
        if (luminances.length === 0) return 0;
        return luminances.reduce((a, b) => a + b, 0) / luminances.length;
    }

    const rgbColor = rgb(color);
    if (!rgbColor) return null;
    const r = toLuminance(rgbColor.r);
    const g = toLuminance(rgbColor.g);
    const b = toLuminance(rgbColor.b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
