import { describe, expectTypeOf, test } from "vitest";
import { Button } from "./button";
import type { ComponentPropsWithRef, ReactNode } from "react";
import type { ButtonProps } from "./button.types";

describe("ButtonProps", () => {
    test("通常ボタンは children があれば書ける", () => {
        expectTypeOf<{ children: ReactNode }>().toExtend<ButtonProps>()
    })

    test("button が受け取れる属性はすべて ButtonProps でも受け取れる", () => {
        expectTypeOf<keyof ComponentPropsWithRef<"button">>().toExtend<keyof ButtonProps>()
    })

    test("children は省略できない", () => {
        expectTypeOf<{ "aria-label": string }>().not.toExtend<ButtonProps>()
    })

    test("iconOnly の union に存在しない値は書けない", () => {
        expectTypeOf<{ iconOnly: "primary", "aria-label": string, children: ReactNode }>().not.toExtend<ButtonProps>()
    })

    test("iconOnly に undefined は書けない", () => {
        expectTypeOf<{ iconOnly: undefined, "aria-label": string, children: ReactNode }>().not.toExtend<ButtonProps>()
    })

    test("iconOnly は aria-label と children があれば書ける", () => {
        expectTypeOf<{ iconOnly: true, "aria-label": string, children: ReactNode }>().toExtend<ButtonProps>()
    })

    test("iconOnly は false を書けない", () => {
        expectTypeOf<{ iconOnly: false, "aria-label": string, children: ReactNode }>().not.toExtend<ButtonProps>()
    })

    test("iconOnly は true 以外を書けない", () => {
        expectTypeOf<{ iconOnly: boolean, "aria-label": string, children: ReactNode }>().not.toExtend<ButtonProps>()
    })

    test("iconOnly は aria-label と children があれば書ける", () => {
        expectTypeOf<{ iconOnly: true, "aria-label": string, children: ReactNode }>().toExtend<ButtonProps>()
    })

    test("iconOnly は aria-label を省略できない", () => {
        expectTypeOf<{ iconOnly: true, children: ReactNode }>().not.toExtend<ButtonProps>()
    })
})

describe("ButtonProps(JSX)", () => {
    test("存在しない props はエラーになる", () => {
        // @ts-expect-error 存在しないpropsのため
        return <Button foo="bar">ボタン</Button>
    })

    test("通常のボタンが書ける", () => {
        return <Button>ボタン</Button>
    })

    test("iconOnly が書ける", () => {
        return <Button iconOnly aria-label="アイコンボタン">ボタン</Button>
    })
})