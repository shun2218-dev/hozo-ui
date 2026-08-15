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

    describe("as", () => {
        test("as='a' を渡すと <a> がレンダリングされる", () => {
            render(<Button as="a" href="/">ボタンリンク</Button>)

            expect(screen.getByRole("link").tagName).toBe("A")
        })

        test("as を省略すると <button> がレンダリングされる", () => {
            render(<Button>ボタン</Button>)

            expect(screen.getByRole("button").tagName).toBe("BUTTON")
        })

        test("as が DOM 属性として出力されない", () => {
            render(<Button as="a" href="/">ボタン</Button>)

            expect(screen.getByRole("link").hasAttribute("as")).toBe(false)
        })

        test("as='a' のとき ref.current に <a> が入る", () => {
            const ref = createRef<HTMLAnchorElement>()

            render(<Button as="a" href="/" ref={ref}>ボタンリンク</Button>)

            expect(ref.current?.tagName).toBe("A")
        })
    })

    describe("disabled", () => {
        test("disabled のとき aria-disabled が付く", () => {
            render(<Button as="a" href="/" disabled>ボタンリンク</Button>)

            expect(screen.getByRole("link").hasAttribute("aria-disabled")).toBe(true)
        })

        test("disabled でないとき aria-disabled が付かない", () => {
            render(<Button as="a" href="/">ボタンリンク</Button>)

            expect(screen.getByRole("link").hasAttribute("aria-disabled")).toBe(false)
        })

        test("as 省略時に href / role / tabIndex が付かない", () => {
            render(<Button>ボタン</Button>)

            expect(screen.getByRole("button").hasAttribute("href")).toBe(false)
            expect(screen.getByRole("button").hasAttribute("role")).toBe(false)
            expect(screen.getByRole("button").hasAttribute("tabIndex")).toBe(false)
        })

        test("利用者の tabIndex を上書きする", () => {
            const USER_TABINDEX = 5
            render(<Button as="a" tabIndex={USER_TABINDEX} href="/" disabled>ボタン</Button>)

            expect(screen.getByRole("link").getAttribute("tabindex")).not.toBe(String(USER_TABINDEX))
        })

        test("disabled のとき role='link' が付く", () => {
            render(<Button as="a" href="/" disabled>ボタンリンク</Button>)

            expect(screen.getByRole("link").getAttribute("role")).toEqual("link")
        })

        test("disabled のとき href が出力されない", () => {
            render(<Button as="a" href="/" disabled>ボタンリンク</Button>)

            expect(screen.getByRole("link").hasAttribute("href")).toBe(false)
        })

        test("disabled のとき tabIndex が付く", () => {
            render(<Button as="a" href="/" disabled>ボタンリンク</Button>)

            expect(screen.getByRole("link").hasAttribute("tabIndex")).toBe(true)
        })

        test("disabled のとき onClick が呼ばれない", () => {
            const handleClick = vi.fn()

            render(<Button onClick={handleClick} disabled>ボタン</Button>)

            const button = screen.getByRole("button")

            fireEvent.click(button);

            expect(handleClick).toHaveBeenCalledTimes(0);
        })
    })
})