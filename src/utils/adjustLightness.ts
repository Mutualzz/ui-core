import type { ColorLike } from "@ui-types";
import { formatHex8, oklch, parse } from "culori";
import { isValidGradient } from "./colorRegex";
import { extractGradientStops, reconstructGradient } from "./gradients";

export const adjustLightness = (color: ColorLike, amount: number): string => {
    const str = String(color).trim();

    if (isValidGradient(str)) {
        const stops = extractGradientStops(str);

        const stopsAdjusted = stops.map((stop) => {
            const parsedColor = parse(stop);
            if (!parsedColor) return stop;
            const oklchColor = oklch(parsedColor);
            // This can be undefined
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!oklchColor) return stop;
            const newLightness = Math.min(
                Math.max(oklchColor.l + amount, 0),
                1,
            );
            const adjusted = {
                ...oklchColor,
                l: newLightness,
                alpha: oklchColor.alpha ?? 1,
            };
            return formatHex8(adjusted);
        });

        return reconstructGradient(str, stopsAdjusted);
    }

    const oklchColor = oklch(color);
    if (!oklchColor) return color;

    const newLightness = Math.min(Math.max(oklchColor.l + amount, 0), 1);
    const adjusted = { ...oklchColor, l: newLightness };

    return formatHex8(adjusted);
};
