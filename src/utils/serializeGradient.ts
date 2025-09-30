import type { AnyObj } from "@ui-types";

export function serializeGradient(node: AnyObj): string {
    switch (node.type) {
        case "linear-gradient":
        case "repeating-linear-gradient":
            return `${node.type}(${serializeLinearOrientation(node.orientation)}${serializeColorStops(node.colorStops)})`;

        case "radial-gradient":
        case "repeating-radial-gradient":
            return `${node.type}(${serializeRadialShapeAndPosition(node.orientation)}${serializeColorStops(node.colorStops)})`;

        default:
            // Fallback for unknown nodes — try color-stop list only
            return `linear-gradient(${serializeColorStops((node as any).colorStops)})`;
    }
}

function serializeLinearOrientation(
    orientation: AnyObj | AnyObj[] | undefined,
): string {
    if (!orientation) return "";
    const parts = Array.isArray(orientation) ? orientation : [orientation];

    const out: string[] = [];
    for (const p of parts) {
        if (!p) continue;
        if (p.type === "directional") out.push(normalizeDirectional(p.value));
        else if (p.type === "angular") out.push(`${p.value}${p.unit || "deg"}`);
        else if (p.type === "position") out.push(serializePosition(p.value));
        else if (p.type === "literal" && p.value) out.push(p.value);
    }
    if (out.length === 0) return "";
    return out.join(" ") + ", ";
}

function serializeRadialShapeAndPosition(
    orientation: AnyObj | AnyObj[] | undefined,
): string {
    if (!orientation) return "";
    const parts = Array.isArray(orientation) ? orientation : [orientation];

    const shapeParts: string[] = [];
    let atPos = "";

    for (const p of parts) {
        if (!p) continue;
        if (p.type === "shape") shapeParts.push(p.value);
        else if (p.type === "extent-keyword") shapeParts.push(p.value);
        else if (p.type === "position")
            atPos = ` at ${serializePosition(p.value)}`;
        else if (p.type === "length") shapeParts.push(serializeLength(p));
        else if (Array.isArray(p.value)) {
            const maybeLengths = p.value
                .map(serializeGeneric)
                .filter(Boolean)
                .join(" ");
            if (maybeLengths) shapeParts.push(maybeLengths);
        }
    }

    const shape = shapeParts.join(" ").trim();
    const prefix = [shape, atPos].join("").trim();
    return prefix ? `${prefix}, ` : "";
}

function serializeColorStops(stops: AnyObj[] = []): string {
    const out = stops.map(serializeColorStop).filter(Boolean).join(", ");
    return out;
}

function serializeColorStop(stop: AnyObj): string {
    const color = serializeColor(stop.value ?? stop);
    let positions = "";
    const len = stop.length;
    if (Array.isArray(len) && len.length > 0) {
        positions =
            " " +
            len
                .map((p: AnyObj) => serializeLengthOrPercentage(p))
                .filter(Boolean)
                .join(" ");
    } else if (len) positions = " " + serializeLengthOrPercentage(len);

    return `${color}${positions}`.trim();
}

function serializeColor(node: AnyObj): string {
    if (!node) return "";
    switch (node.type) {
        case "hex":
            return `#${node.value}`;
        case "literal":
            return node.value;
        case "rgb":
        case "rgba":
        case "hsl":
        case "hsla":
            return `${node.type}(${node.value.map(serializeColorComponent).join(", ")})`;
        default:
            if (typeof node.value === "string") return node.value;
            return "";
    }
}

function serializeColorComponent(comp: AnyObj): string {
    if (typeof comp === "string") return comp;
    if (typeof comp?.value === "string" && comp.unit)
        return `${comp.value}${comp.unit}`;
    if (typeof comp?.value === "string") return comp.value;
    return String(comp ?? "");
}

function serializeLengthOrPercentage(node: AnyObj): string {
    if (!node) return "";
    if (node.type === "percentage") return `${node.value}%`;
    return serializeLength(node);
}

function serializeLength(node: AnyObj): string {
    if (!node) return "";
    const v = node.value ?? node.number ?? node.amount ?? "";
    const u = node.unit ?? "";
    if (v === "") return "";
    return `${v}${u}`;
}

function serializePosition(value: AnyObj[] | AnyObj | string): string {
    if (typeof value === "string") return value;
    const parts = Array.isArray(value) ? value : [value];
    return parts
        .map((p) => {
            if (!p) return "";
            if (typeof p === "string") return p;
            if (p.type === "keyword") return p.value;
            if (p.type === "percentage") return `${p.value}%`;
            if (p.type === "length") return serializeLength(p);
            return p.value ?? "";
        })
        .filter(Boolean)
        .join(" ");
}

function serializeGeneric(x: AnyObj): string {
    if (!x) return "";
    if (typeof x === "string") return x;
    if (typeof x.value === "string" && !x.unit) return x.value;
    if (x.type === "percentage") return `${x.value}%`;
    if (x.type === "length") return serializeLength(x);
    if (x.type === "keyword") return x.value;
    return "";
}

function normalizeDirectional(v?: string): string {
    if (!v) return "";
    const hasTo = v.trim().startsWith("to ");
    const keywords = v.replace(/^to\s+/, "").trim();
    return hasTo ? v : `to ${keywords}`;
}
