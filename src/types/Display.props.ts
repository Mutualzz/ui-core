import type { Responsive } from ".";

import { type Properties } from "csstype";

export interface HTMLDisplayProps {
    display?: Responsive<Properties["display"]>;

    overflow?: Responsive<Properties["overflow"]>;
    overflowX?: Responsive<Properties["overflowX"]>;
    overflowY?: Responsive<Properties["overflowY"]>;

    visibility?: Responsive<Properties["visibility"]>;

    whiteSpace?: Responsive<Properties["whiteSpace"]>;
}
