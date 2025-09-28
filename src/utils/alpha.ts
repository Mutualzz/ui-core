import type { ColorLike } from "@ui-types";
import { formatHex8, parse, rgb } from "culori";
import { isValidGradient } from "./colorRegex";
import { extractGradientStops, reconstructGradient } from "./gradients";

export const alpha = (base: ColorLike | string, value: number) => {
    const str = String(base).trim();

    if (isValidGradient(str)) {
        const stops = extractGradientStops(str);

        const stopsWithAlpha = stops.map((stop) => {
            const parsedColor = parse(stop);
            if (!parsedColor) return stop;
            return formatHex8({ ...parsedColor, alpha: value });
        });

        return reconstructGradient(str, stopsWithAlpha);
    }

    const parsedColor = rgb(base);
    if (!parsedColor) return base;

    return formatHex8({ ...parsedColor, alpha: value });
};
