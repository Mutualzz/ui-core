import type { RefObject } from "react";

export function setRef<T>(
    ref:
        | RefObject<T | null>
        | ((instance: T | null) => void)
        | null
        | undefined,
    value: T | null,
): void {
    if (typeof ref === "function") {
        ref(value);
    } else if (ref) {
        ref.current = value;
    }
}
