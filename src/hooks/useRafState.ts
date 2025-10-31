import { useEffect, useRef, useState } from "react";
import { useEvent } from "./useEvent";

export function useRafState<T>(
    initial: T,
): [T, (v: T | ((p: T) => T)) => void] {
    const [state, setState] = useState<T>(initial);
    const frame = useRef<number | null>(null);
    const nextVal = useRef<T>(initial);

    const schedule = useEvent((v: T | ((p: T) => T)) => {
        if (typeof v === "function")
            (nextVal as any).current = (v as any)(nextVal.current);
        else nextVal.current = v as T;
        if (frame.current == null) {
            frame.current = requestAnimationFrame(() => {
                setState(nextVal.current);
                frame.current = null;
            });
        }
    });

    useEffect(
        () => () => {
            if (frame.current != null) cancelAnimationFrame(frame.current);
        },
        [],
    );
    return [state, schedule];
}
