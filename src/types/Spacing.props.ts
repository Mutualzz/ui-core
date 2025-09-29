import type { AllowNumber, Responsive } from ".";

import { type Properties } from "csstype";

export interface HTMLSpacingProps {
    gap?: Responsive<AllowNumber<Properties["gap"]>>;
    spacing?: Responsive<AllowNumber<Properties["gap"]>>;

    rowGap?: Responsive<AllowNumber<Properties["rowGap"]>>;
    columnGap?: Responsive<AllowNumber<Properties["columnGap"]>>;

    m?: Responsive<AllowNumber<Properties["margin"]>>;
    mt?: Responsive<AllowNumber<Properties["marginTop"]>>;
    mr?: Responsive<AllowNumber<Properties["marginRight"]>>;
    mb?: Responsive<AllowNumber<Properties["marginBottom"]>>;
    ml?: Responsive<AllowNumber<Properties["marginLeft"]>>;
    mx?: Responsive<AllowNumber<Properties["marginInline"]>>;
    my?: Responsive<AllowNumber<Properties["marginBlock"]>>;

    p?: Responsive<AllowNumber<Properties["padding"]>>;
    pt?: Responsive<AllowNumber<Properties["paddingTop"]>>;
    pr?: Responsive<AllowNumber<Properties["paddingRight"]>>;
    pb?: Responsive<AllowNumber<Properties["paddingBottom"]>>;
    pl?: Responsive<AllowNumber<Properties["paddingLeft"]>>;
    px?: Responsive<AllowNumber<Properties["paddingInline"]>>;
    py?: Responsive<AllowNumber<Properties["paddingBlock"]>>;

    margin?: Responsive<AllowNumber<Properties["margin"]>>;
    marginTop?: Responsive<AllowNumber<Properties["marginTop"]>>;
    marginRight?: Responsive<AllowNumber<Properties["marginRight"]>>;
    marginBottom?: Responsive<AllowNumber<Properties["marginBottom"]>>;
    marginLeft?: Responsive<AllowNumber<Properties["marginLeft"]>>;
    marginX?: Responsive<AllowNumber<Properties["marginInline"]>>;
    marginY?: Responsive<AllowNumber<Properties["marginBlock"]>>;

    padding?: Responsive<AllowNumber<Properties["padding"]>>;
    paddingTop?: Responsive<AllowNumber<Properties["paddingTop"]>>;
    paddingRight?: Responsive<AllowNumber<Properties["paddingRight"]>>;
    paddingBottom?: Responsive<AllowNumber<Properties["paddingBottom"]>>;
    paddingLeft?: Responsive<AllowNumber<Properties["paddingLeft"]>>;
    paddingX?: Responsive<AllowNumber<Properties["paddingInline"]>>;
    paddingY?: Responsive<AllowNumber<Properties["paddingBlock"]>>;
}
