import { type Theme } from "@emotion/react";
import type { SystemProps } from "@ui-types";
import { aliasToStyles } from "./aliasToStyles";
import { aliasMaps } from "./aliases";

export function systemToCss(props: SystemProps, theme: Theme) {
    const relevant: Record<string, any> = {};
    const filteredKeys = Object.keys(aliasMaps).filter(
        (key) => !["color", "bgColor", "backgroundColor"].includes(key),
    ) as (keyof typeof aliasMaps)[];

    for (const key of filteredKeys) {
        if (props[key as keyof typeof props] != null)
            relevant[key] = props[key as keyof typeof props];
    }

    return aliasToStyles(relevant, theme);
}
