import type { CSSObject } from "@emotion/react";
import type { HTMLAttributes } from "react";
import type { HTMLBorderProps } from "./Border.props";
import type { HTMLDisplayProps } from "./Display.props";
import type { HTMLFlexboxProps } from "./Flexbox.props";
import type { HTMLPositionsProps } from "./Positions.props";
import type { HTMLShadowsProps } from "./Shadows.props";
import type { HTMLSizingProps } from "./Sizing.props";
import type { HTMLSpacingProps } from "./Spacing.props";
import type { HTMLTypographyProps } from "./Typography.props";

export type Hex = `#${string}`;
export type RGB = `rgb(${number}, ${number}, ${number})`;
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export type HSL = `hsl(${number}, ${number}%, ${number}%)`;
export type HSLA = `hsla(${number}, ${number}%, ${number}%, ${number})`;
export type HSV = `hsv(${number}, ${number}%, ${number}%)`;
export type HSVA = `hsva(${number}, ${number}%, ${number}%, ${number})`;

export interface HsvColor {
    h: number;
    s: number;
    v: number;
}

export interface HsvaColor extends HsvColor {
    alpha: number;
}

export interface HslColor {
    h: number;
    s: number;
    l: number;
}
export interface HslaColor extends HslColor {
    alpha: number;
}

export interface RgbColor {
    r: number;
    g: number;
    b: number;
}
export interface RgbaColor extends RgbColor {
    alpha: number;
}

export interface XYColor {
    x: number;
    y: number;
    bri?: number;
}

export interface ColorResult {
    rgb: RgbColor;
    hsl: HslColor;
    hsv: HsvColor;
    rgba: RgbaColor;
    hsla: HslaColor;
    hsva: HsvaColor;
    xy: XYColor;
    hex: Hex;
    hexa: Hex;
}

export type ObjectColor =
    | RgbColor
    | HslColor
    | HsvColor
    | RgbaColor
    | HslaColor
    | HsvaColor;

export type LinearGradient = `linear-gradient(${string})`;
export type RadialGradient = `radial-gradient(${string})`;
export type ConicGradient = `conic-gradient(${string})`;

export type Gradient = LinearGradient | RadialGradient | ConicGradient;

export type ColorLike = Hex | RGB | RGBA | HSL | HSLA | HSV | HSVA | Gradient;

export type ColorFormat = "hex" | "rgb" | "hsl" | "hsv";

export type AnyObj = Record<string, any>;

export type Color =
    | "primary"
    | "neutral"
    | "success"
    | "danger"
    | "warning"
    | "info";

export type TypographyColor =
    | "primary"
    | "secondary"
    | "accent"
    | "muted"
    | "transparent"
    | "inherit";

export type Variant = "plain" | "outlined" | "soft" | "solid";

export type Orientation = "horizontal" | "vertical";

export type TypographyDisplayKey =
    | "display-xs"
    | "display-sm"
    | "display-md"
    | "display-lg";
export type TypographyHeadingKey = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type TypographyTitleKey = "title-sm" | "title-md" | "title-lg";
export type TypographyBodyKey = "body-xs" | "body-sm" | "body-md" | "body-lg";

export type TypographyLevel =
    | TypographyBodyKey
    | TypographyTitleKey
    | TypographyHeadingKey
    | TypographyDisplayKey;

export interface TypographyLevelObj {
    fontSize: number;
    lineHeight: string | number;
    fontWeight: string | number;
    letterSpacing: string | number;
}

export interface Interaction {
    left: number;
    top: number;
    width: number;
    height: number;
    x: number;
    y: number;
}

export type Size = "sm" | "md" | "lg";

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";
export type Spacing = "xs" | "sm" | "md" | "lg" | "xl";
export type Shape = "circle" | "square" | "rounded";

export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;
export type ThemeType = "light" | "dark";
export type ThemeStyle = "normal" | "gradient";

export type AllowNumber<T> = T | number;

export type SystemProps<T = HTMLElement> = HTMLAttributes<T> &
    HTMLBorderProps &
    HTMLDisplayProps &
    HTMLFlexboxProps &
    // HTMLPaletteProps &
    HTMLPositionsProps &
    HTMLShadowsProps &
    HTMLSizingProps &
    HTMLSpacingProps &
    HTMLTypographyProps & { css?: CSSObject };

export type Px = `${number}px`;
export type Rem = `${number}rem`;
export type Em = `${number}em`;
export type Percent = `${number}%`;
export type Vh = `${number}vh`;
export type Vw = `${number}vw`;
export type Vmin = `${number}vmin`;
export type Vmax = `${number}vmax`;
export type Pt = `${number}pt`;
export type Fr = `${number}fr`; // For CSS Grid

export type AbsoluteSize = Px | Pt;
export type RelativeSize = Em | Rem | Percent | Vh | Vw | Vmin | Vmax | Fr;

export type SizeValue = AbsoluteSize | RelativeSize;

export type UnitSuffix =
    | "px"
    | "rem"
    | "em"
    | "%"
    | "vh"
    | "vw"
    | "vmin"
    | "vmax"
    | "pt"
    | "fr";

export interface MzTheme {
    id: string;
    name: string;
    description?: string | null;
    adaptive: boolean;
    type: ThemeType;
    style: ThemeStyle;
    colors: {
        common: {
            white: ColorLike;
            black: ColorLike;
        };

        // Base Colors
        primary: ColorLike;
        neutral: ColorLike;
        background: ColorLike;
        surface: ColorLike;

        // Feedback colors
        danger: ColorLike;
        warning: ColorLike;
        info: ColorLike;
        success: ColorLike;
    };
    typography: {
        fontFamily: string;
        colors: {
            primary: ColorLike;
            secondary: ColorLike;
            accent: ColorLike;
            muted: ColorLike;
        };
        levels: Record<TypographyLevel, TypographyLevelObj>;
    };
    breakpoints: {
        keys: Breakpoint[];
        values: Record<Breakpoint, number>;
        up: (key: Breakpoint) => string;
        down: (key: Breakpoint) => string;
        between: (start: Breakpoint, end: Breakpoint) => string;
        only: (key: Breakpoint) => string;
        not: (key: Breakpoint) => string;
    };

    spacing: (factor: number) => string;

    shadows: string[];

    zIndex: {
        mobileStepper: number;
        fab: number;
        speedDial: number;
        appBar: number;
        drawer: number;
        modal: number;
        snackbar: number;
        tooltip: number;
    };

    createdAt?: Date;
    updatedAt?: Date;
}

declare module "@emotion/react" {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface Theme extends MzTheme {}
}
