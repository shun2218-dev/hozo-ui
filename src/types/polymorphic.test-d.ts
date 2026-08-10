import { describe, expectTypeOf, test } from "vitest";
import type { PolymorphicProps } from "./polymorphic";

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
})