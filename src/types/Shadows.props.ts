import type { Properties } from "csstype";
import type { AllowNumber, Responsive } from "./index";

export interface HTMLShadowsProps {
    boxShadow?: Responsive<AllowNumber<Properties["boxShadow"]>>;
}
