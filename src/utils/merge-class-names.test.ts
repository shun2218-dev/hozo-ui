import { describe, expect, test } from "vitest";
import { mergeClassNames } from "./merge-class-names";

describe("mergeClassNames", () => {
    describe("連結", () => {
        test("複数の文字列を空白 1 つで連結する", () => {
            expect(mergeClassNames("a", "b")).toEqual("a b")
        })

        test("undefined を除外して連結する", () => {
            expect(mergeClassNames("a", undefined, "b")).toEqual("a b")
        })

        test("空文字を除外して連結する", () => {
            expect(mergeClassNames("a", "", "b")).toEqual("a b")
        })

        test("undefined と空文字が混在していても除外して連結する", () => {
            expect(mergeClassNames("", undefined, "a")).toEqual("a")
        })

    })

    describe("undefined を返す条件", () => {
        test("引数がない場合", () => {
            expect(mergeClassNames()).toBeUndefined()
        })

        test("全ての引数が undefined の場合", () => {
            expect(mergeClassNames(undefined, undefined)).toBeUndefined()
        })

        test("全ての引数が空文字の場合", () => {
            expect(mergeClassNames("", "")).toBeUndefined()
        })
    })

})