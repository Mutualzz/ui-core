import type { Interaction } from "@ui-types";
import { clamp } from "./number";
import { isTouch } from "./touch";

export const getRelativePosition = (
    node: HTMLDivElement,
    event: MouseEvent | TouchEvent,
): Interaction => {
    const rect = node.getBoundingClientRect();

    // Get user's pointer position from `touches` array if it's a `TouchEvent`
    const pointer = isTouch(event) ? event.touches[0] : (event as MouseEvent);

    return {
        left: clamp(
            (pointer.pageX - (rect.left + window.pageXOffset)) / rect.width,
        ),
        top: clamp(
            (pointer.pageY - (rect.top + window.pageYOffset)) / rect.height,
        ),
        width: rect.width,
        height: rect.height,
        x: pointer.pageX - (rect.left + window.pageXOffset),
        y: pointer.pageY - (rect.top + window.pageYOffset),
    };
};
