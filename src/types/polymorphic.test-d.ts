import { expectTypeOf, test } from "vitest";

test("ダミーテスト", () => {
    // @ts-expect-error テスト
    expectTypeOf<string | number>().toEqualTypeOf<string>()
})