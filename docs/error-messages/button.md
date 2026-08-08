# Button のエラーメッセージ

対象の型: [`src/components/button/button.types.ts`](../../src/components/button/button.types.ts)

書き方は [README.md](./README.md) を参照。

採取条件: `npx tsc --noEmit --pretty false`。E-001〜004 は `--noErrorTruncation` を付けても**出力が完全に同じ**だった（畳み込みが発生していない）。判別子が浅い union なので型が畳まれるほど大きくならない。段階 3（polymorphic）で条件型が入ったら再採取する。

---

### E-001 | `iconOnly` なのに `aria-label` が無い

原則 1 の中核。CONCEPT.md §2 が例として挙げているケースそのもの。

**書いたコード**

```tsx
<Button iconOnly>アイコン</Button>
```

**エラー全文**

```
error TS2322: Type '{ children: string; iconOnly: true; }' is not assignable to type 'IntrinsicAttributes & ButtonProps'.
  Property '"aria-label"' is missing in type '{ children: string; iconOnly: true; }' but required in type 'IconButtonProps'.
```

- **行数**: 2
- **読めるか**: ○
- **利用者は原因に辿り着けるか**: 辿り着ける。2 行目に `Property '"aria-label"' is missing` と欠けている prop 名が出る。ただし摩擦が 2 つある。(1) 1 行目の `IntrinsicAttributes & ButtonProps` は情報量ゼロで、読み飛ばす必要がある。(2) `IconButtonProps` は **export していない内部の型名**で、利用者が照合できる先が存在しない
- **改善案**: 「なぜ必須なのか」（= `iconOnly` を書いたから）がメッセージのどこにも無い。`iconOnly: true` は再掲されているので推測は可能だが、明示されてはいない。分岐の型名を利用者に意味が通る名前にするか、ヒント型を混ぜて理由を載せる余地がある。ただし現状でも直し方には到達できるので、優先度は中

---

### E-002 | `children` が無い

**書いたコード**

```tsx
<Button iconOnly aria-label="アイコンボタン" />
```

**エラー全文**

```
error TS2322: Type '{ iconOnly: true; "aria-label": string; }' is not assignable to type 'IntrinsicAttributes & ButtonProps'.
  Property 'children' is missing in type '{ iconOnly: true; "aria-label": string; }' but required in type 'IconButtonProps'.
```

- **行数**: 2
- **読めるか**: ○
- **利用者は原因に辿り着けるか**: 辿り着ける。E-001 と同じ構造だが、`children` は React 標準の概念なので、内部型名 `IconButtonProps` を知らなくても意味が通る。E-001 より親切
- **改善案**: 特になし。優先度低。内部型名の露出は E-001 と共通の課題で、そちらの改善に含まれる

---

### E-003 | `iconOnly` に `false` を渡す

判別子を `true` リテラルにしたため、`false` はどちらの分岐にも該当しない。

**書いたコード**

```tsx
<Button iconOnly={false}>text</Button>
```

**エラー全文**

```
error TS2322: Type 'false' is not assignable to type 'true'.
```

- **行数**: 1
- **読めるか**: △
- **利用者は原因に辿り着けるか**: 位置情報があれば辿り着ける。ただし**本文に prop 名が一切出ない**ため、テキスト出力（CI ログ）だけを見る場面では `file:line:col` を頼りにソースを開く必要がある。エディタ上なら波線の位置で自明
- **改善案**: 「`false` を書く必要はない。省略すればよい」という**次の一手が示されない**。利用者は「では `iconOnly` を消せばいいのか、別の値があるのか」を自分で判断することになる。boolean リテラルを判別子にする限りこのメッセージは変えられないので、改善するなら prop の設計側（省略で表現する意図をどう伝えるか）の問題になる

---

### E-004 | `iconOnly` に boolean 変数を渡す

`iconOnly` を通常の boolean prop だと考えて `iconOnly={isIcon}` と書くケース。他のライブラリから来た利用者が最もやりやすい誤り。**設計上意図的に禁じている書き方**なので、メッセージがその理由を説明できているかが論点になる。

**書いたコード**

```tsx
<Button iconOnly={isIcon} aria-label="閉じる">icon</Button>
```

**エラー全文**

```
error TS2322: Type 'boolean' is not assignable to type 'true'.
```

**採取上の注意**: `const isIcon: boolean = false` のように定数へ直接代入すると、TypeScript の絞り込みが働いて `Type 'false' is not assignable` （= E-003 と同じ文面）になる。`boolean` のまま渡すには `declare const` や関数の引数など、絞り込まれない形にする必要がある。

- **行数**: 1
- **読めるか**: △
- **利用者は原因に辿り着けるか**: **辿り着きにくい。4 件の中で最も悪い。** 「`true` しか受け付けない」ことは読めるが、**なぜ**かも、**代わりにどう書くか**も示されない。条件でアイコンボタンと通常ボタンを出し分けたい利用者は、要素ごと分岐させる必要があることを自力で気づくしかない
- **改善案**: これは型の不備ではなく**設計判断（`iconOnly` は変数で渡せない）が型に現れているだけ**なので、メッセージ単体では解決しない。取りうる方向は 3 つ。(1) 設計を変えて `boolean` を許す — ただし `false` のとき `aria-label` 必須をどう解除するかという別問題が出る。(2) ヒント型を混ぜて「条件付きで渡す場合は要素を分岐させてください」相当の文字列を型名に載せる（原則 3 の手法。R-001 の埋め込み手法の応用）。(3) ドキュメントで代替の書き方を示す — 型で防ぐというライブラリの主張からは後退。**(2) を試す価値がある。この 1 件が Hozo UI の主張を検証する題材になる**

---

## 参考 — 外部ライブラリの例

自作の型ではないが、比較対象として残す。

### R-001 | `expectTypeOf` で主語と述語がねじれた場合

型メッセージの設計に力を入れているライブラリでも、こうなるという例。

**書いたコード**

```ts
expectTypeOf<ButtonProps>().toExtend<ButtonProps["onClick"]>();
```

「props オブジェクトはイベントハンドラ関数である」という成立しない主張。

**エラー全文**

```
src/components/button/button.test-d.tsx(8,42): error TS2344: Type 'MouseEventHandler<HTMLButtonElement> | undefined' does not satisfy the constraint '{ form: "Expected: never, Actual: string" | "Expected: never, Actual: undefined"; slot: "Expected: never, Actual: string" | "Expected: never, Actual: undefined"; style: "Expected: never, Actual: undefined" | "Expected: never, Actual: ..."; ... 287 more ...; onTransitionStartCapture: "Expected: never, Actual: undefin...'.
  Type 'undefined' is not assignable to type '{ form: "Expected: never, Actual: string" | "Expected: never, Actual: undefined"; slot: "Expected: never, Actual: string" | "Expected: never, Actual: undefined"; style: "Expected: never, Actual: undefined" | "Expected: never, Actual: ..."; ... 287 more ...; onTransitionStartCapture: "Expected: never, Actual: undefin...'.
```

- **行数**: 3（ただし 1 行が数千文字）
- **読めるか**: ✕
- **利用者は原因に辿り着けるか**: 辿り着けない。「主語と述語がねじれている」ことはメッセージのどこにも書かれていない
- **観察**: `"Expected: never, Actual: string"` という**文字列リテラル型に人間向けメッセージを埋め込む**手法自体は原則 3 の実践例。しかし対象の型が 290 プロパティあると、その手法ごと畳まれて機能しなくなる
- **教訓**: 文字列リテラル型にメッセージを埋め込む手法は、**埋め込み先の型が小さいときにしか機能しない**。290 プロパティのオブジェクト型に適用すると、tsc の畳み込みでメッセージごと `...` に消える。自作で使うなら、埋め込み先を 1 プロパティか単独の型に限定する。E-004 の改善案 (2) を試すときの前提条件になる
