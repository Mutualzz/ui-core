import type { Theme } from "@emotion/react";
import type { Breakpoint } from "@ui-types";
import { aliasMaps } from "./aliases";

export function aliasToStyles(props: Record<string, any>, theme: Theme) {
    const output: Record<string, any> = {};

    const resolveValue = (key: string, raw: any) => {
        if (raw == null) return raw;
        // NOTE - For now we are not going to be using the theme.spacing function
        /*if (/^[mp]/.test(key) && typeof raw === "number") {
            return theme.spacing(raw);
        }*/

        if (key === "boxShadow" && typeof raw === "number") {
            return theme.shadows[raw] ?? raw;
        }

        if (key === "zIndex" && typeof raw === "string") {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            return theme.zIndex[raw as keyof typeof theme.zIndex] ?? raw;
        }

        return raw;
    };

    const findNextLargerValue = (
        currentIndex: number,
        allBreakpoints: Breakpoint[],
        sortedBreakpoints: Breakpoint[],
        raw: any,
    ) => {
        for (const bp of sortedBreakpoints) {
            const index = allBreakpoints.indexOf(bp);
            if (index > currentIndex) return raw[bp];
        }

        return raw[sortedBreakpoints[sortedBreakpoints.length - 1]];
    };

    for (const key in props) {
        const raw = props[key];
        if (raw == null) continue;

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const cssProps = aliasMaps[key as keyof typeof aliasMaps]?.slice() ?? [
            key,
        ];

        if (typeof raw === "object" && !Array.isArray(raw)) {
            const allBreakpoints = theme.breakpoints.keys;
            const definedBreakpoints = Object.keys(raw) as Breakpoint[];

            const sortedBreakpoints = definedBreakpoints.toSorted(
                (a, b) => allBreakpoints.indexOf(a) - allBreakpoints.indexOf(b),
            );

            const smallestBreakpoint = sortedBreakpoints[0];
            const smallestIndex = allBreakpoints.indexOf(smallestBreakpoint);

            for (let i = 0; i < allBreakpoints.length; i++) {
                const currentBreakpoint = allBreakpoints[i];
                let value: any = undefined;

                if (raw[currentBreakpoint] !== undefined)
                    value = raw[currentBreakpoint];
                else if (i < smallestIndex) value = raw[smallestBreakpoint];
                else
                    value = findNextLargerValue(
                        i,
                        allBreakpoints,
                        sortedBreakpoints,
                        raw,
                    );

                if (value !== undefined) {
                    const resolved = resolveValue(key, value);
                    if (i === 0) {
                        cssProps.forEach((prop) => {
                            output[prop] = resolved;
                        });
                    } else {
                        const media = theme.breakpoints.up(currentBreakpoint);
                        output[media] = output[media] ?? {};
                        cssProps.forEach((prop) => {
                            output[media][prop] = resolved;
                        });
                    }
                }
            }
        } else {
            const resolved = resolveValue(key, raw);
            cssProps.forEach((prop) => {
                output[prop] = resolved;
            });
        }
    }

    return output;
}
