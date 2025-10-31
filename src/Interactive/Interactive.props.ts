import type { Interaction } from "@ui-types";
import type { HTMLAttributes } from "react";

export interface InteractiveProps extends HTMLAttributes<HTMLDivElement> {
    onMove?: (interaction: Interaction, event: MouseEvent | TouchEvent) => void;
    onDown?: (offset: Interaction, event: MouseEvent | TouchEvent) => void;
}
