import type { ColorLike } from "@ui-types";
import Color, { type ColorInstance } from "color";
import gradientParser from "gradient-parser";
import { isValidGradient } from "./colorRegex";

type OutputFormat = "hex" | "hexa" | "rgb" | "rgba" | "hsl" | "hsla";

type FormatOptions = {
    format?: OutputFormat;
    alpha?: number; // 0-100

    // modifiers
    negate?: boolean;
    invert?: boolean;
    grayscale?: boolean;
    greyscale?: boolean;

    // adjustments
    lighten?: number; // 0-100
    darken?: number; // 0-100
    lightness?: number; // 0-100
    saturate?: number; // 0-100
    desaturate?: number; // 0-100
    whiten?: number; // 0-100
    blacken?: number; // 0-100
    fade?: number; // 0-100
    opaquer?: number; // 0-100
};

const defaultFormatOptions: FormatOptions = {
    alpha: 100,
    format: "hex",
};

export function formatColor(
    inputColor: ColorInstance | ColorLike,
    options: FormatOptions = defaultFormatOptions,
): ColorLike {
    const {
        alpha = 100,
        format = "hex",
        negate,
        invert,
        grayscale,
        greyscale,
        lighten,
        darken,
        lightness,
        saturate,
        desaturate,
        whiten,
        blacken,
        fade,
        opaquer,
    } = options;
    const colorStr =
        typeof inputColor === "string" ? inputColor : inputColor.string();

    if (isValidGradient(colorStr)) {
        const gradientAst = gradientParser.parse(colorStr)[0];

        for (const stop of gradientAst.colorStops) {
            try {
                if (stop.type === "literal" || stop.type === "var") continue;

                let col = new Color(serializeColorValue(stop.value)).alpha(
                    alpha / 100,
                );

                if (negate && !invert) col = col.negate();
                if (invert && !negate) col = col.negate(); // alias
                if (grayscale || greyscale) col = col.grayscale();
                if (lighten) col = col.lighten(lighten / 100);
                if (darken) col = col.darken(darken / 100);
                if (lightness) col = col.lightness(lightness);
                if (saturate) col = col.saturate(saturate / 100);
                if (desaturate) col = col.desaturate(desaturate / 100);
                if (whiten) col = col.whiten(whiten / 100);
                if (blacken) col = col.blacken(blacken / 100);
                if (fade) col = col.fade(fade / 100);
                if (opaquer) col = col.opaquer(opaquer / 100);

                const { type, value } = colorToAstNode(col, format);
                stop.type = type;
                stop.value = value;
            } catch {
                // ignore invalid stops
            }
        }

        return gradientParser.stringify([gradientAst]) as ColorLike;
    }

    let col = new Color(colorStr).alpha(alpha / 100);

    if (negate && !invert) col = col.negate();
    if (invert && !negate) col = col.negate();
    if (grayscale || greyscale) col = col.grayscale();
    if (lighten) col = col.lighten(lighten / 100);
    if (darken) col = col.darken(darken / 100);
    if (lightness) col = col.lightness(lightness);
    if (saturate) col = col.saturate(saturate / 100);
    if (desaturate) col = col.desaturate(desaturate / 100);
    if (whiten) col = col.whiten(whiten / 100);
    if (blacken) col = col.blacken(blacken / 100);
    if (fade) col = col.fade(fade / 100);
    if (opaquer) col = col.opaquer(opaquer / 100);

    return formatSolidColor(col, format) as ColorLike;
}

export function dynamicElevation(color: ColorLike, elevation: number) {
    if (isValidGradient(color)) {
        const gradientAst = gradientParser.parse(color)[0];

        for (const stop of gradientAst.colorStops) {
            try {
                if (stop.type === "literal" || stop.type === "var") continue;

                let col = new Color(serializeColorValue(stop.value));

                const increment = 0.02;
                const lightness = col.lightness();
                const newLightness = Math.min(
                    lightness + elevation * increment * 100,
                    100,
                );
                col = col.lightness(newLightness);

                const { type, value } = colorToAstNode(col, "rgb");
                stop.type = type;
                stop.value = value;
            } catch {
                // ignore invalid stops
            }
        }

        return gradientParser.stringify([gradientAst]);
    }

    let col = new Color(color);

    const increment = 0.02;
    const lightness = col.lightness();
    const newLightness = Math.min(lightness + elevation * increment * 100, 100);
    col = col.lightness(newLightness);

    return formatSolidColor(col, "rgb");
}

function formatSolidColor(
    instance: ColorInstance,
    format: OutputFormat,
): string {
    switch (format) {
        case "hex":
            return instance.hex();
        case "hexa":
            return instance.hexa();
        case "rgb":
        case "rgba":
            return instance.rgb().string();
        case "hsl":
        case "hsla":
            return instance.hsl().string();
        default:
            return instance.string();
    }
}

type AstNode = {
    type: "hex" | "rgb" | "rgba" | "hsl" | "hsla";
    value: any;
};

function colorToAstNode(
    instance: ColorInstance,
    format: OutputFormat,
): AstNode {
    switch (format) {
        case "hex": {
            const hex = instance.hex().replace(/^#/, "");
            return { type: "hex", value: hex };
        }
        case "hexa": {
            const hexa = instance.hexa().replace(/^#/, "");
            return { type: "hex", value: hexa };
        }
        case "rgb": {
            const { r, g, b } = instance.rgb().object();
            return {
                type: "rgb",
                value: [{ value: r }, { value: g }, { value: b }],
            };
        }
        case "rgba": {
            const { r, g, b, alpha } = instance.rgb().object();
            return {
                type: "rgba",
                value: [
                    { value: r },
                    { value: g },
                    { value: b },
                    { value: alpha ?? 1, unit: "" },
                ],
            };
        }
        case "hsl": {
            const { h, s, l } = instance.hsl().object();
            return {
                type: "hsl",
                value: [
                    { value: h },
                    { value: s, unit: "%" },
                    { value: l, unit: "%" },
                ],
            };
        }
        case "hsla": {
            const { h, s, l, alpha } = instance.hsl().object();
            return {
                type: "hsla",
                value: [
                    { value: h },
                    { value: s, unit: "%" },
                    { value: l, unit: "%" },
                    { value: alpha ?? 1, unit: "" },
                ],
            };
        }
        default:
            return { type: "hex", value: instance.hex().replace(/^#/, "") };
    }
}

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
