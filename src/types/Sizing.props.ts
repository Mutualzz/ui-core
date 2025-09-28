import type { AllowNumber, Responsive } from "./index";

import { type Properties } from "csstype";

export interface HTMLSizingProps {
    width?: Responsive<AllowNumber<Properties["width"]>>;
    minWidth?: Responsive<AllowNumber<Properties["minWidth"]>>;
    maxWidth?: Responsive<AllowNumber<Properties["maxWidth"]>>;
    height?: Responsive<AllowNumber<Properties["height"]>>;
    minHeight?: Responsive<AllowNumber<Properties["minHeight"]>>;
    maxHeight?: Responsive<AllowNumber<Properties["maxHeight"]>>;

    boxSizing?: Responsive<Properties["boxSizing"]>;
}
