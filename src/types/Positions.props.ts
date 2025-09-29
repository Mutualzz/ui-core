import type { Theme } from "@emotion/react";
import type { Properties } from "csstype";
import { type AllowNumber, type Responsive } from ".";

export interface HTMLPositionsProps {
    position?: Responsive<Properties["position"]>;
    zIndex?: Responsive<
        AllowNumber<Properties["zIndex"]> | keyof Theme["zIndex"]
    >;
    top?: Responsive<AllowNumber<Properties["top"]>>;
    right?: Responsive<AllowNumber<Properties["right"]>>;
    bottom?: Responsive<AllowNumber<Properties["bottom"]>>;
    left?: Responsive<AllowNumber<Properties["left"]>>;
}
