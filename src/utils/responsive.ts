import type { Theme } from "@emotion/react";
import type { Breakpoint, Responsive } from "@ui-types";

export const resolveResponsiveProp = <T>(
    theme: Theme,
    prop: Responsive<T>,
): { base: T; queries: Record<string, T> } => {
    if (prop == null || typeof prop !== "object" || Array.isArray(prop)) {
        return { base: prop, queries: {} };
    }

    const bpProp = prop as Partial<Record<Breakpoint, T>>;

    const allBreakpoints = theme.breakpoints.keys;
    const definedBreakpoints = Object.keys(bpProp) as Breakpoint[];

    if (definedBreakpoints.length === 0)
        return { base: prop as T, queries: {} };

    const sortedBreakpoints = definedBreakpoints.toSorted(
        (a, b) => allBreakpoints.indexOf(a) - allBreakpoints.indexOf(b),
    );
    const smallestBreakpoint = sortedBreakpoints[0];
    const smallestIndex = allBreakpoints.indexOf(smallestBreakpoint);

    const result: { base: T; queries: Record<string, T> } = {
        base: bpProp[smallestBreakpoint]!,
        queries: {},
    };

    for (let i = 0; i < allBreakpoints.length; i++) {
        const currentBreakpoint = allBreakpoints[i];
        let value: T | undefined;

        if (bpProp[currentBreakpoint] !== undefined)
            value = bpProp[currentBreakpoint];
        else if (i < smallestIndex) value = bpProp[smallestBreakpoint];
        else {
            for (const bp of sortedBreakpoints) {
                const index = allBreakpoints.indexOf(bp);
                if (index > i) {
                    value = bpProp[bp];
                    break;
                }
            }
            if (!value)
                value = bpProp[sortedBreakpoints[sortedBreakpoints.length - 1]];
        }

        if (i === 0) {
            result.base = value!;
        } else {
            const media = theme.breakpoints.up(currentBreakpoint);
            result.queries[media] = value!;
        }
    }

    return result;
};

export const resolveResponsiveStyles = <T>(
    theme: Theme,
    prop: Responsive<T>,
    styleFn: (value: T) => Record<string, any>,
): Record<string, any> => {
    const { base, queries } = resolveResponsiveProp(theme, prop);

    const styles = {
        ...styleFn(base),
    };

    for (const [media, value] of Object.entries(queries)) {
        styles[media] = styleFn(value);
    }

    return styles;
};

function resolveValueAtBreakpoint<T>(
    theme: Theme,
    prop: Responsive<T>,
    bp: string,
): T {
    if (typeof prop === "object" && prop !== null && !Array.isArray(prop)) {
        const { base, queries } = resolveResponsiveProp(theme, prop);
        if (bp === theme.breakpoints.keys[0]) return base;
        const media = theme.breakpoints.up(bp as Breakpoint);
        return queries[media] ?? base;
    }
    return prop;
}

export const resolveResponsiveMerge = <T extends Record<string, any>>(
    theme: Theme,
    props: { [K in keyof T]: Responsive<T[K]> },
    styleFn: (values: T) => Record<string, any>,
): Record<string, any> => {
    const breakpoints = theme.breakpoints.keys;
    const merged: Responsive<T> = {} as Responsive<T>;

    for (const bp of breakpoints) {
        const values: Partial<T> = {};
        for (const key in props) {
            values[key as keyof T] = resolveValueAtBreakpoint(
                theme,
                props[key],
                bp,
            ) as T[keyof T];
        }
        merged[bp] = values as T;
    }

    return resolveResponsiveStyles(theme, merged, styleFn);
};
