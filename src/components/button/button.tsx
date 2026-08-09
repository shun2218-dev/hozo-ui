import { mergeClassNames } from "../../utils/merge-class-names";
import type { ButtonProps } from "./button.types";

export function Button({ className, iconOnly, children, ...props }: ButtonProps) {
    return <button {...props} className={mergeClassNames("hozo-button", className)} data-icon-only={iconOnly}>{children}</button>
}