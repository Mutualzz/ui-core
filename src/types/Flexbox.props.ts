import type { AllowNumber, Responsive } from ".";

import type { Properties } from "csstype";

export interface HTMLFlexboxProps {
    flexDirection?: Responsive<Properties["flexDirection"]>;
    direction?: Responsive<Properties["flexDirection"]>;

    flexWrap?: Responsive<Properties["flexWrap"]>;
    wrap?: Responsive<Properties["flexWrap"]>;

    justifyContent?: Responsive<Properties["justifyContent"]>;
    alignItems?: Responsive<Properties["alignItems"]>;
    alignContent?: Responsive<Properties["alignContent"]>;

    order?: Responsive<AllowNumber<Properties["order"]>>;

    flex?: Responsive<AllowNumber<Properties["flex"]>>;

    flexGrow?: Responsive<AllowNumber<Properties["flexGrow"]>>;
    grow?: Responsive<AllowNumber<Properties["flexGrow"]>>;

    flexShrink?: Responsive<AllowNumber<Properties["flexShrink"]>>;
    shrink?: Responsive<AllowNumber<Properties["flexShrink"]>>;

    alignSelf?: Responsive<Properties["alignSelf"]>;
}
