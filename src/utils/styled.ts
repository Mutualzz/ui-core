import type { Interpolation, Theme } from "@emotion/react";
import styledBase, { type StyledOptions } from "@emotion/styled";
import type { ComponentPropsWithRef, ComponentType, JSX } from "react";

import isPropValid from "@emotion/is-prop-valid";
import type { SystemProps } from "@ui-types";
import { aliasMaps } from "./aliases";
import type { SxProps } from "./sxToCss";
import { sxToCss } from "./sxToCss";
import { systemToCss } from "./systemToCss";

const blockedProps = ["sx", "as", "theme", ...Object.keys(aliasMaps)];

// don’t forward sx, theme, as, or any of your system-prop keys
const shouldForwardProp = (prop: string) =>
    isPropValid(prop) && !blockedProps.includes(prop);

// what the consumer sees (no theme in their props)
type PublicProps<P> = P & { sx?: SxProps; theme?: Theme };

// what your style callbacks receive (adds theme)
type CallbackProps<P> = PublicProps<P> & { theme: Theme };

interface StyledWithSxInterface {
    <Tag extends keyof JSX.IntrinsicElements>(
        tag: Tag,
        options?: StyledOptions,
    ): <Props extends object = object>(
        ...styles: (
            | TemplateStringsArray
            | Interpolation<CallbackProps<JSX.IntrinsicElements[Tag] & Props>>
            | string
            | number
        )[]
    ) => ComponentType<PublicProps<JSX.IntrinsicElements[Tag] & Props>>;

    <Component extends ComponentType<any>>(
        component: Component,
        options?: StyledOptions,
    ): <Props extends object = object>(
        ...styles: (
            | TemplateStringsArray
            | Interpolation<
                  CallbackProps<ComponentPropsWithRef<Component> & Props>
              >
            | string
            | number
        )[]
    ) => ComponentType<PublicProps<ComponentPropsWithRef<Component> & Props>>;
}

type StyledWithSx = StyledWithSxInterface & typeof styledBase;

const styled = new Proxy(styledBase, {
    apply(_target, _thisArg, [component, options]: any) {
        const mergedOptions: StyledOptions = {
            ...(options ?? {}),
            shouldForwardProp,
        };
        const factory = styledBase(component, mergedOptions);

        return (...styles: any[]) => {
            const sysStyle = (props: any) =>
                systemToCss(props as SystemProps, props.theme);

            const sxStyle = (props: any) =>
                sxToCss(props.sx ?? {}, props.theme);

            return factory(sysStyle, sxStyle, ...styles);
        };
    },

    get(_target, prop: string) {
        const orig = styledBase[prop as keyof StyledWithSxInterface];
        if (typeof orig === "function") {
            return new Proxy(orig, {
                apply(_fn, _thisArg, args: any[]) {
                    const factory = (styledBase as any)(prop, {
                        shouldForwardProp,
                    });
                    const sysStyle = (props: any) =>
                        systemToCss(props as SystemProps, props.theme);
                    const sxStyle = (props: any) =>
                        sxToCss(props.sx ?? {}, props.theme);
                    return factory(sysStyle, sxStyle, ...args);
                },
            });
        }
        return orig;
    },
}) as StyledWithSx;

export default styled;
