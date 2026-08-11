import type { ElementType } from "react";
import { mergeClassNames } from "../../utils/merge-class-names";
import type { ButtonProps } from "./button.types";
import type { PolymorphicProps } from "../../types/polymorphic";

export function Button<E extends ElementType = "button">({ className, iconOnly, children, as, ...props }: PolymorphicProps<E, ButtonProps>) {
    const Component = as ?? "button";
    return <Component {...props} className={mergeClassNames("hozo-button", className)} data-icon-only={iconOnly}>{children}</Component>
}