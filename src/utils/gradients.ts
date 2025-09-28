import { parse } from "culori";

export const extractGradientStops = (gradient: string): string[] => {
    const match = gradient.match(/^[a-zA-Z-]+-gradient\(([\s\S]*)\)$/);
    if (!match) return [];

    // Split by commas, but ignore commas inside parentheses (e.g., rgb(…))
    const stops = [];
    let buffer = "";
    let depth = 0;
    for (const char of match[1]) {
        if (char === "(") depth++;
        if (char === ")") depth--;
        if (char === "," && depth === 0) {
            stops.push(buffer.trim());
            buffer = "";
        } else {
            buffer += char;
        }
    }
    if (buffer) stops.push(buffer.trim());

    // Check if the first stop is an angle or direction
    const angleRegex = /^(\d+deg|\d+rad|\d+grad|\d+turn|to\b.*)$/i;
    let startIdx = 0;
    if (stops.length && angleRegex.test(stops[0])) {
        startIdx = 1;
    }

    // Extract color part from each stop (ignore position for now)
    return stops.slice(startIdx).map((stop) => {
        // Split by space, but only the first part is the color
        const [color] = stop.split(/\s+(?![^(]*\))/);
        return color;
    });
};

export const reconstructGradient = (
    original: string,
    newColors: string[],
): string => {
    const funcMatch = original.match(/^([a-zA-Z-]+-gradient)\((.*)\)$/);
    if (!funcMatch) return original;
    const [, funcName, inner] = funcMatch;

    const stops = [];
    let buffer = "";
    let depth = 0;
    for (const char of inner) {
        if (char === "(") depth++;
        if (char === ")") depth--;
        if (char === "," && depth === 0) {
            stops.push(buffer.trim());
            buffer = "";
        } else {
            buffer += char;
        }
    }
    if (buffer) stops.push(buffer.trim());

    let colorIdx = 0;
    const rebuiltStops = stops.map((stop) => {
        // Split by space, but only the first part is the color
        const parts = stop.split(/\s+(?![^(]*\))/);
        const color = parts[0];
        if (parse(color)) {
            // Replace only the color part, keep position if present
            const rebuilt = [newColors[colorIdx], ...parts.slice(1)].join(" ");
            colorIdx++;
            return rebuilt;
        }
        // Not a color, just return as-is (e.g., "100%")
        return stop;
    });

    return `${funcName}(${rebuiltStops.join(", ")})`;
};
