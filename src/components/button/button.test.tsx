import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Button } from "./button";
import { createRef } from "react";

const DEFAULT_CLASSNAME = "hozo-button";

describe("Button", () => {

    describe("props の転送", () => {
        test("ref が DOM 要素に転送される", () => {
            const ref = createRef<HTMLButtonElement>();

            render(<Button ref={ref}>ボタン</Button>)

            expect(ref.current).toBe(screen.getByRole("button"))
        })

        test("未知の props が DOM 要素に転送される", () => {
            const handleClick = vi.fn()

            render(<Button onClick={handleClick}>ボタン</Button>)

            const button = screen.getByRole("button")

            fireEvent.click(button);

            expect(handleClick).toHaveBeenCalledTimes(1);
        })
    })

    describe("className", () => {
        test("ベースクラスと結合される", () => {
            const CUSTOM_CLASSNAME = "custom-class"

            render(<Button className={CUSTOM_CLASSNAME}>ボタン</Button>)

            expect(screen.getByRole("button").className).toEqual(`${DEFAULT_CLASSNAME} ${CUSTOM_CLASSNAME}`)
        })

        test("className を渡さない場合はベースクラスのみになる", () => {
            render(<Button>ボタン</Button>)

            expect(screen.getByRole("button").className).toEqual(DEFAULT_CLASSNAME)
        })
    })

    describe("data 属性", () => {

        test("iconOnly を指定すると data-icon-only が付与される", () => {
            render(<Button iconOnly aria-label="アイコンボタン">ボタン</Button>)

            expect(screen.getByRole("button").hasAttribute("data-icon-only")).toBe(true)
        })

        test("iconOnly を指定しないと data-icon-only が付与されない", () => {
            render(<Button>ボタン</Button>)

            expect(screen.getByRole("button").hasAttribute("data-icon-only")).toBe(false)
        })
    })
})