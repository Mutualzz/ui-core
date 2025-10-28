import { useCallback, useMemo, useRef } from "react";

export function useForkRef<Instance>(
    ...refs: (React.Ref<Instance> | undefined)[]
): React.RefCallback<Instance> | null {
    const cleanupRef = useRef<void | (() => void)>(undefined);

    const refEffect = useCallback((instance: Instance | null) => {
        const cleanups = refs.map((ref) => {
            if (ref == null) {
                return null;
            }

            if (typeof ref === "function") {
                const refCallback = ref;
                const refCleanup: void | (() => void) = refCallback(instance);
                return typeof refCleanup === "function"
                    ? refCleanup
                    : () => {
                          refCallback(null);
                      };
            }

            ref.current = instance;
            return () => {
                ref.current = null;
            };
        });

        return () => {
            cleanups.forEach((refCleanup) => refCleanup?.());
        };
    }, refs);

    return useMemo(() => {
        if (refs.every((ref) => ref == null)) {
            return null;
        }

        return (value) => {
            if (cleanupRef.current) {
                cleanupRef.current();
                (cleanupRef as React.RefObject<void | (() => void)>).current =
                    undefined;
            }

            if (value != null) {
                (cleanupRef as React.RefObject<void | (() => void)>).current =
                    refEffect(value);
            }
        };
    }, refs);
}
