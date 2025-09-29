import type { ColorLike } from "@ui-types";
import Color from "color";
import gradientParser from "gradient-parser";
import { isValidGradient } from "./colorRegex";

export const formatHex = (color: ColorLike, alpha = 100) => {
    if (isValidGradient(color)) {
        const stops = gradientParser.parse(color);
    }

    const instance = new Color(color).alpha(alpha / 100);
    return alpha === 100 ? instance.hex() : instance.hexa();
};
