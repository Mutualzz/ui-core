import type { AllowNumber, Responsive } from "./index";

import { type Properties } from "csstype";

export interface HTMLTypographyProps {
    fontFamily?: Responsive<Properties["fontFamily"]>;
    fontSize?: Responsive<AllowNumber<Properties["fontSize"]>>;
    fontStyle?: Responsive<Properties["fontStyle"]>;
    fontWeight?: Responsive<AllowNumber<Properties["fontWeight"]>>;
    letterSpacing?: Responsive<AllowNumber<Properties["letterSpacing"]>>;
    lineHeight?: Responsive<AllowNumber<Properties["lineHeight"]>>;
    textAlign?: Responsive<Properties["textAlign"]>;
    textTransform?: Responsive<Properties["textTransform"]>;

    textDecoration?: Responsive<Properties["textDecoration"]>;
    textDecorationLine?: Responsive<Properties["textDecorationLine"]>;
    textDecorationColor?: Responsive<Properties["textDecorationColor"]>;
    textDecorationStyle?: Responsive<Properties["textDecorationStyle"]>;

    textOverflow?: Responsive<Properties["textOverflow"]>;
}
