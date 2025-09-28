import type { AllowNumber, Color, ColorLike, Responsive } from "./index";

import { type Properties } from "csstype";

export interface HTMLBorderProps {
    border?: Responsive<Properties["border"]>;

    borderColor?: Responsive<Color | ColorLike | Properties["borderColor"]>;
    borderRadius?: Responsive<AllowNumber<Properties["borderRadius"]>>;
    borderWidth?: Responsive<AllowNumber<Properties["borderWidth"]>>;

    borderTop?: Responsive<AllowNumber<Properties["borderTop"]>>;
    borderTopColor?: Responsive<
        Color | ColorLike | Properties["borderTopColor"]
    >;
    borderTopWidth?: Responsive<AllowNumber<Properties["borderTopWidth"]>>;
    borderTopStyle?: Responsive<Properties["borderTopStyle"]>;
    borderTopRadius?: Responsive<
        AllowNumber<
            | Properties["borderTopLeftRadius"]
            | Properties["borderTopRightRadius"]
        >
    >;
    borderTopLeftRadius?: Responsive<
        AllowNumber<Properties["borderTopLeftRadius"]>
    >;
    borderTopRightRadius?: Responsive<
        AllowNumber<Properties["borderTopRightRadius"]>
    >;

    borderRight?: Responsive<AllowNumber<Properties["borderRight"]>>;
    borderRightColor?: Responsive<
        Color | ColorLike | Properties["borderRightColor"]
    >;
    borderRightWidth?: Responsive<AllowNumber<Properties["borderRightWidth"]>>;
    borderRightStyle?: Responsive<Properties["borderRightStyle"]>;
    borderBottom?: Responsive<AllowNumber<Properties["borderBottom"]>>;
    borderBottomColor?: Responsive<
        Color | ColorLike | Properties["borderBottomColor"]
    >;
    borderBottomWidth?: Responsive<
        AllowNumber<Properties["borderBottomWidth"]>
    >;
    borderBottomStyle?: Responsive<Properties["borderBottomStyle"]>;
    borderLeft?: Responsive<AllowNumber<Properties["borderLeft"]>>;
    borderLeftColor?: Responsive<
        Color | ColorLike | Properties["borderLeftColor"]
    >;
    borderLeftWidth?: Responsive<AllowNumber<Properties["borderLeftWidth"]>>;
    borderLeftStyle?: Responsive<Properties["borderLeftStyle"]>;
}
