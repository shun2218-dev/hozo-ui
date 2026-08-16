import { describe, expectTypeOf, test } from "vitest";
import type { PolymorphicProps } from "./polymorphic";
import type { Ref } from "react";

type OwnProps = { variant: string }

type CollisionOwnProps = { className: number }

describe("PolymorphicProps", () => {
    test("as='a' のとき href が受け取れる", () => {
        expectTypeOf<"href">().toExtend<keyof PolymorphicProps<"a", OwnProps>>()
    })

    test("as='button' のとき href が受け取れない", () => {
        expectTypeOf<"href">().not.toExtend<keyof PolymorphicProps<"button", OwnProps>>()
    })

    test("OwnProps のキーが要素側と衝突したら OwnProps が勝つ", () => {
        expectTypeOf<PolymorphicProps<"button", CollisionOwnProps>["className"]>().toEqualTypeOf<CollisionOwnProps["className"]>()
    })

    test("E が 'a' のとき ref が HTMLAnchorElement になる", () => {
        expectTypeOf<PolymorphicProps<"a", OwnProps>["ref"]>().toEqualTypeOf<Ref<HTMLAnchorElement> | undefined>()
    })

    test("E が 'button' のとき ref が HTMLButtonElement になる", () => {
        expectTypeOf<PolymorphicProps<"button", OwnProps>["ref"]>().toEqualTypeOf<Ref<HTMLButtonElement> | undefined>()
    })
})