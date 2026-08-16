import type { ComponentRef, ElementType, MouseEventHandler } from "react";
import { mergeClassNames } from "../../utils/merge-class-names";
import type { ButtonProps } from "./button.types";
import type { PolymorphicProps } from "../../types/polymorphic";

export function Button<E extends ElementType = "button">({ className, iconOnly, children, disabled, as, onClick, ...props }: PolymorphicProps<E, ButtonProps>) {
    const Component: ElementType = as ?? "button";

    const disabledOnClick: MouseEventHandler<ComponentRef<E>> = (e) => {
        e.preventDefault();
    }

    const disabledProps = disabled ? { "aria-disabled": true, ...(as === "a" ? { role: "link", href: undefined, tabIndex: 0 } : undefined) } : undefined

    return <Component {...props} {...disabledProps} className={mergeClassNames("hozo-button", className)} data-icon-only={iconOnly} onClick={disabled ? disabledOnClick : onClick}>{children}</Component>
}