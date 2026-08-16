import { describe, expectTypeOf, test } from "vitest";
import { Button } from "./button";
import { createRef, type ComponentProps, type ComponentPropsWithRef, type ReactNode } from "react";

type ButtonProps = ComponentProps<typeof Button>

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

    test("iconOnly は aria-label を省略できない", () => {
        expectTypeOf<{ iconOnly: true, children: ReactNode }>().not.toExtend<ButtonProps>()
    })

    test("disabled を受け取れる", () => {
        expectTypeOf<{ disabled: boolean, children: ReactNode }>().toExtend<ButtonProps>()
    })

    test("iconOnly と disabled を同時に受け取れる", () => {
        expectTypeOf<{ iconOnly: true, "aria-label": string, disabled: boolean, children: ReactNode }>().toExtend<ButtonProps>()
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

    test("as='a' iconOnly で aria-label を省略するとエラーになる", () => {
        // @ts-expect-error iconOnly では aria-label が必須のため
        return <Button as="a" iconOnly>ボタン</Button>
    })

    test("as='a' にすると href が書ける", () => {
        return <Button as="a" href="/">ボタンリンク</Button>
    })

    test("as を省略して href を書くとエラーになる", () => {
        // @ts-expect-error as を省略すると E が "button" に確定するので href を受け取れないため
        return <Button href="/">ボタン</Button>
    })

    test("as 省略に anchor 用 ref を渡すとエラー", () => {
        const anchorRef = createRef<HTMLAnchorElement>()
        // @ts-expect-error as を省略すると E が "button" に確定するのに ref が anchor 用のため
        return <Button href="/" ref={anchorRef}>ボタンリンク</Button>
    })

    test("as='a' に button 用 ref を渡すとエラー", () => {
        const buttonRef = createRef<HTMLButtonElement>()
        // @ts-expect-error as="a" で ref が button 用のため
        return <Button as="a" ref={buttonRef}>ボタン</Button>
    })

    test("as='a' でも disabled を受け取れる", () => {
        return <Button as="a" href="/" disabled>ボタン</Button>
    })

    test("as 省略に aria-disabled を利用者が直接書けない", () => {
        // @ts-expect-error aria-disabled を利用者が直接書くのは禁止のため
        return <Button aria-disabled>ボタン</Button>
    })

    test("as='a' でも aria-disabled を利用者が直接書けない", () => {
        // @ts-expect-error as で他の要素を指定しても aria-disabled を利用者が直接書くのは禁止のため
        return <Button as="a" href="/" aria-disabled>ボタン</Button>
    })
})