import type { ColorLike } from "@ui-types";
import Color from "color";
import gradientParser from "gradient-parser";
import { isValidGradient } from "./colorRegex";

// TODO: Keep working on this function to support gradients properly
// And other formats like rgb and etc later
export const formatHex = (color: ColorLike, alpha = 100) => {
    if (isValidGradient(color)) {
        const stops = gradientParser.parse(color)[0];
        const formattedStops = [];

        for (const stop of stops.colorStops) {
            try {
                if (stop.type === "literal" || stop.type === "var") continue;

                const col = new Color(serializeColorValue(stop.value));
                stop.type = "hex";

                const hextStr =
                    alpha === 100
                        ? col.alpha(alpha / 100).hex()
                        : col.alpha(alpha / 100).hexa();

                stop.value = hextStr.replace(/^#/, "");
            } catch {
                // ignore invalid stops
            }
        }
    }

    const instance = new Color(color).alpha(alpha / 100);
    return alpha === 100 ? instance.hex() : instance.hexa();
};

function serializeColorValue(node: any): string {
    switch (node.type) {
        case "hex":
            return `#${node.value}`;
        case "literal":
            return node.value;
        case "rgb":
        case "rgba":
        case "hsl":
        case "hsla":
            return `${node.type}(${node.value
                .map((c: any) => (c.unit ? `${c.value}${c.unit}` : c.value))
                .join(", ")})`;
        default:
            return "";
    }
}
