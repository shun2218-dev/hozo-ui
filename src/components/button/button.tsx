import type { ButtonProps } from "./button.types";

export function Button({ iconOnly, children, ...props }: ButtonProps) {
    return <button {...props} data-icon-only={iconOnly}>{children}</button>
}