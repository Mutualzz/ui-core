import type { Theme } from "@emotion/react";
import type {
    ColorLike,
    ColorResult,
    Hex,
    HslaColor,
    HslColor,
    HsvaColor,
    HsvColor,
    ObjectColor,
    RgbaColor,
    RgbColor,
    XYColor,
} from "@ui-types";
import Color, { type ColorInstance } from "color";
import gradientParser, { type AngularNode, type HexNode, } from "gradient-parser";
import { isValidGradient, isValidHex } from "./colorRegex";
import { randomColor, randomHexColor } from "./randomColor";

type OutputFormat =
    | "hex"
    | "hexa"
    | "rgb"
    | "rgba"
    | "hsl"
    | "hsla"
    | "hsv"
    | "hsva";

interface FormatOptions {
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
}

export function formatColor(
    inputColor: ColorInstance | ColorLike | ObjectColor,
    options: FormatOptions,
): ColorLike {
    const {
        alpha,
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
        typeof inputColor === "string"
            ? inputColor
            : isColorInstance(inputColor)
              ? inputColor.string()
              : new Color(inputColor).string();

    if (isValidGradient(colorStr)) {
        const gradientAst = gradientParser.parse(colorStr)[0];

        for (const stop of gradientAst.colorStops) {
            try {
                if (stop.type === "literal" || stop.type === "var") continue;

                let col = new Color(serializeColorValue(stop));

                if (alpha) col = col.alpha(alpha / 100);
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
            } catch (err) {
                // ignore invalid stops
                console.error(err);
            }
        }

        return gradientParser.stringify([gradientAst]) as ColorLike;
    }

    try {
        let col = new Color(colorStr);

        if (alpha) col = col.alpha(alpha / 100);
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
    } catch {
        return new Color(randomHexColor()).hex() as ColorLike;
    }
}

function isColorInstance(value: any): value is ColorInstance {
    return value != null && typeof (value as any).string === "function";
}

export function createColor(color?: ColorLike, theme?: Theme): ColorInstance {
    if (!color) return Color(theme?.colors.neutral) || randomColor();
    try {
        return new Color(color);
    } catch {
        return new Color(theme?.colors.neutral || randomColor());
    }
}

export const handleColor = (str: string | HsvaColor): ColorResult => {
    let rgb!: RgbColor;
    let hsl!: HslColor;
    let hsv!: HsvColor;
    let rgba!: RgbaColor;
    let hsla!: HslaColor;
    let hsva!: HsvaColor;
    let xy!: XYColor;
    let hex!: Hex;
    let hexa!: Hex;
    if (typeof str === "string" && isValidHex(str)) {
        hsva = new Color(str).hsv().object() as unknown as HsvaColor;
        hex = str as Hex;
    } else if (typeof str !== "string") {
        // @ts-expect-error We expect str to not have position but we need to strip it runtime since its coming from a different component
        const { position, ...rest } = str;
        hsva = rest;
    }

    if (hsva) {
        const color = new Color(hsva);
        hsv = color.hsv().object() as unknown as HsvColor;
        hsla = color.hsl().object() as unknown as HslaColor;
        rgba = color.rgb().object() as unknown as RgbaColor;
        hexa = color.hexa() as Hex;
        hex = color.hex() as Hex;
        hsl = color.hsl().object() as unknown as HslColor;
        rgb = color.rgb().object() as unknown as RgbColor;
        xy = color.xyz().object() as unknown as XYColor;
    }
    return { rgb, hsl, hsv, rgba, hsla, hsva, hex, hexa, xy };
};

export function dynamicElevation(
    color: ColorLike,
    elevation: number,
    format: OutputFormat = "hex",
): ColorLike {
    if (isValidGradient(color)) {
        const gradientAst = gradientParser.parse(color)[0];

        for (const stop of gradientAst.colorStops) {
            try {
                if (stop.type === "literal" || stop.type === "var") continue;

                let col = new Color(serializeColorValue(stop));

                const increment = 0.01;
                const lightness = col.lightness();
                const newLightness = Math.min(
                    lightness + elevation * increment * 100,
                    100,
                );
                col = col.lightness(newLightness);

                const { type, value } = colorToAstNode(col, format);
                stop.type = type;
                stop.value = value;
            } catch (err: any) {
                // ignore invalid stops
                console.error(err.stack);
            }
        }

        return gradientParser.stringify([gradientAst]) as ColorLike;
    }

    let col = new Color(color);

    const increment = 0.02;
    const lightness = col.lightness();
    const newLightness = Math.min(lightness + elevation * increment * 100, 100);
    col = col.lightness(newLightness);

    return formatSolidColor(col, format);
}

export const extractColors = (css: ColorLike): ColorLike[] | null => {
    if (!css) return null;
    if (!isValidGradient(css)) return null;
    const ast = gradientParser.parse(css)[0];
    if (!ast || !ast.colorStops) return null;

    const colors: ColorLike[] = [];
    for (const stop of ast.colorStops) {
        if (stop.type === "literal" || stop.type === "var") continue;
        colors.push(serializeColorValue(stop));
    }

    return colors.length > 0 ? colors : null;
};

interface GradientInfo {
    angle: number;
    colors: ColorLike[];
    positions: number[];
}

export const extractGradientInfo = (css: ColorLike): GradientInfo | null => {
    if (!css) return null;
    if (!isValidGradient(css)) return null;
    const ast = gradientParser.parse(css)[0];
    if (!ast || !ast.colorStops) return null;

    const colors: ColorLike[] = [];
    const positions: number[] = [];
    for (const stop of ast.colorStops) {
        if (stop.type === "literal" || stop.type === "var") continue;
        colors.push(serializeColorValue(stop));
        if (stop.length && stop.length.type === "%") {
            positions.push(parseFloat(stop.length.value) / 100);
        }
    }

    return {
        angle: parseFloat((ast.orientation as AngularNode).value) || 180,
        colors,
        positions,
    };
};

export const constructLinearGradient = (
    orientation: number,
    stops: { color: Hex; position: number }[],
): ColorLike => {
    return gradientParser.stringify([
        {
            type: "linear-gradient",
            orientation: {
                type: "angular",
                value: orientation.toString(),
            },
            colorStops: stops.map(
                ({ color, position }) =>
                    ({
                        type: "hex",
                        value: color.replace("#", ""),
                        length: {
                            type: "%",
                            value: position.toFixed(1),
                        },
                    }) as HexNode,
            ),
        },
    ]) as ColorLike;
};

function formatSolidColor(
    instance: ColorInstance,
    format: OutputFormat,
): ColorLike {
    switch (format) {
        case "hex":
            return instance.hex() as ColorLike;
        case "hexa":
            return instance.hexa() as ColorLike;
        case "rgb":
        case "rgba":
            return instance.rgb().string() as ColorLike;
        case "hsl":
        case "hsla":
            return instance.hsl().string() as ColorLike;
        case "hsv":
        case "hsva":
            return instance.hsv().string() as ColorLike;
        default:
            return instance.string() as ColorLike;
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
            const hex = instance.hex().replace(/^#/g, "");
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
                value: [r, g, b],
            };
        }
        case "rgba": {
            const { r, g, b, alpha } = instance.rgb().object();
            return {
                type: "rgba",
                value: [r, g, b, alpha],
            };
        }
        case "hsl": {
            const { h, s, l } = instance.hsl().object();
            return {
                type: "hsl",
                value: [h, s, l],
            };
        }
        case "hsla": {
            const { h, s, l, alpha } = instance.hsl().object();
            return {
                type: "hsla",
                value: [h, s, l, alpha],
            };
        }
        default:
            return { type: "hex", value: instance.hex().replace(/^#/, "") };
    }
}

export function serializeColorValue(node: any): ColorLike {
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
                .join(", ")})` as ColorLike;
        default:
            return "" as ColorLike;
    }
}
