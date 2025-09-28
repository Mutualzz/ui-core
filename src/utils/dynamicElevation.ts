import type { ColorLike } from "@ui-types";
import { formatRgb, oklch, parse } from "culori";
import { isValidGradient } from "./colorRegex";
import { extractGradientStops, reconstructGradient } from "./gradients";

export const dynamicElevation = (
    color: ColorLike,
    elevation: number,
): string => {
    if (isValidGradient(color)) {
        const stops = extractGradientStops(color);
        const validStops = stops.filter((stop) => parse(stop)) as ColorLike[];
        const elevatedStops = validStops.map((stop) =>
            dynamicElevation(stop, elevation),
        );

        return reconstructGradient(color, elevatedStops);
    }

    const parsedColor = parse(color);
    if (!parsedColor) return color;

    const oklchColor = oklch(parsedColor);

    const increment = 0.02;

    const newLightness = Math.min(oklchColor.l + elevation * increment, 1);

    const adjustedColor = {
        ...oklchColor,
        l: newLightness,
        alpha: oklchColor.alpha ?? 1,
    };

    return formatRgb(adjustedColor);
};
