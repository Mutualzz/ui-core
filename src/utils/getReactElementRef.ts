import { version, type ReactElement } from "react";

export function getReactElementRef(
    element: ReactElement,
): React.Ref<any> | null {
    // 'ref' is passed as prop in React 19, whereas 'ref' is directly attached to children in older versions
    if (parseInt(version, 10) >= 19) {
        return (element.props as any)?.ref || null;
    }
    // @ts-expect-error element.ref is not included in the ReactElement type
    // https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/70189
    return element.ref || null;
}
