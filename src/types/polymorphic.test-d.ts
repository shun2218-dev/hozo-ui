import { expectTypeOf, test } from "vitest";

test("ダミーテスト", () => {
    expectTypeOf<string>().toEqualTypeOf<string>()
})