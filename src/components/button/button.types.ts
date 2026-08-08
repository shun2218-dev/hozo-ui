import type { ComponentPropsWithRef, ReactNode } from "react"

type IconButtonProps = {
    iconOnly: true
    "aria-label": string
    children: ReactNode
}

type BaseButtonProps = {
    iconOnly?: never
    children: ReactNode
}

export type ButtonProps = ComponentPropsWithRef<"button"> & (IconButtonProps | BaseButtonProps)