import type { ComponentPropsWithRef, ElementType } from "react";

export type PolymorphicProps<E extends ElementType, OwnProps> = OwnProps & {
    as?: E
} & Omit<ComponentPropsWithRef<E>, "as" | keyof OwnProps>