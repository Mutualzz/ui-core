import * as gp from "gradient-parser";

type GPNode = gp.GradientNode;
type StopNode = GPNode["colorStops"][number];

const colorToCss = (c: StopNode): string => {
    switch (c.type) {
        case "literal":
            return c.value;
        case "hex":
            return `#${c.value}`;
        case "rgb":
            return `rgb(${c.value.join(", ")})`;
        case "rgba":
            return `rgba(${c.value.join(", ")})`;
        default: {
            const val = Array.isArray((c as any).value)
                ? (c as any).value.join(", ")
                : String((c as any).value ?? "");
            return `${c.type}(${val})`;
        }
    }
};

const lenToCss = (len?: { value?: string | number; type?: string }) =>
    !len || len.value == null ? "" : `${Number(len.value)}${len.type ?? ""}`;

export const stringifyGradient = (node: GPNode): string => {
    const fn = node.type; // e.g., "linear-gradient", "radial-gradient", "repeating-…"
    const head = fn.includes("linear")
        ? linearOrientationToCss((node as gp.LinearGradientNode).orientation)
        : radialOrientationToCss((node as gp.RadialGradientNode).orientation);

    const stops = node.colorStops.map(
        (s) => `${colorToCss(s)}${s.length ? ` ${lenToCss(s.length)}` : ""}`,
    );
    return `${fn}(${[head, ...stops].filter(Boolean).join(", ")})`;
};

const linearOrientationToCss = (o?: gp.LinearGradientNode["orientation"]) =>
    !o ? "" : o.type === "angular" ? `${o.value}deg` : `to ${o.value}`;

const radialOrientationToCss = (arr?: gp.RadialGradientNode["orientation"]) => {
    if (!arr?.length) return "";
    const bits: string[] = [];
    for (const p of arr) {
        if (p.type === "shape") {
            if (p.value) bits.push(p.value); // circle|ellipse
            const extent = (p as any).style?.value ?? (p as any).size?.value;
            if (extent) bits.push(extent); // closest-corner, etc.
            if ((p as any).at) {
                const { x, y } = (p as any).at;
                const xr = x ? lenToCss(x as any) : "";
                const yr = y ? lenToCss(y as any) : "";
                if (xr || yr)
                    bits.push(`at ${[xr, yr].filter(Boolean).join(" ")}`);
            }
        } else if (p.type === "default-radial" && (p as any).at) {
            const { x, y } = (p as any).at;
            const xr = x ? lenToCss(x as any) : "";
            const yr = y ? lenToCss(y as any) : "";
            if (xr || yr) bits.push(`at ${[xr, yr].filter(Boolean).join(" ")}`);
        }
    }
    return bits.join(" ");
};
