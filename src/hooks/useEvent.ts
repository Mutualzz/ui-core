import { useCallback, useLayoutEffect, useRef } from "react";

export function useEvent<T extends (...args: any[]) => any>(fn: T) {
    const ref = useRef(fn);
    useLayoutEffect(() => {
        ref.current = fn;
    });
    return useCallback((...args: Parameters<T>) => ref.current(...args), []);
}
