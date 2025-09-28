import { type Theme } from "@emotion/react";
import type { Responsive } from "@ui-types";
import type { Properties as CSSProperties } from "csstype";
import { type AliasKey } from "./aliases";
import { aliasToStyles } from "./aliasToStyles";

export type SxProps = {
    [K in keyof CSSProperties]?: Responsive<CSSProperties[K]>;
} & Partial<Record<AliasKey, Responsive<string | number>>>;

export function sxToCss(sx: SxProps = {}, theme: Theme) {
    return aliasToStyles(sx, theme);
}
