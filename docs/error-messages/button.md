# Button のエラーメッセージ

対象の型: [`src/components/button/button.types.ts`](../../src/components/button/button.types.ts) / [`src/types/polymorphic.ts`](../../src/types/polymorphic.ts)

書き方は [README.md](./README.md) を参照。

採取条件: `npx tsc --noEmit --pretty false`。E-001〜007 は `--noErrorTruncation` を付けても**出力が完全に同じ**（畳み込みが発生していない）。

## 再採取の記録

**polymorphic（`as` prop）の導入後に E-001〜004 を採り直した。結果は「ほぼ変化なし」。**

CONCEPT.md 7 節の「既知の罠 1 — エラーメッセージの崩壊」は、**現時点では起きていない**。

- 変わったのは型名の表示だけ。`ButtonProps` → `PolymorphicProps<"button", ButtonProps>`
- 行数、畳み込みの有無、読みやすさはいずれも変化なし
- 崩壊しなかった理由の推測: `PolymorphicProps` は交差型と `Omit` だけで構成され、**条件型を使っていない**。tsc は `Omit` の結果を展開せず型名のまま表示するため、union の分岐数も文字数も増えなかった

`expect-type` が R-001 で崩壊したのは条件型を多用しているためで、**「型を複雑にすると必ず崩壊する」わけではない**。崩壊させるのは条件型による展開であって、交差型やジェネリックそのものではない。

再々採取のタイミング: 条件型（`E extends "a" ? ... : ...` の形）を型に入れたとき。

---

### E-001 | `iconOnly` なのに `aria-label` が無い

原則 1 の中核。CONCEPT.md §2 が例として挙げているケースそのもの。

**書いたコード**

```tsx
<Button iconOnly>アイコン</Button>
```

**エラー全文**

```
error TS2322: Type '{ children: string; iconOnly: true; }' is not assignable to type 'IntrinsicAttributes & PolymorphicProps<"button", ButtonProps>'.
  Property '"aria-label"' is missing in type '{ children: string; iconOnly: true; }' but required in type '{ iconOnly: true; "aria-label": string; children: ReactNode; }'.
```

- **行数**: 2
- **読めるか**: ○
- **利用者は原因に辿り着けるか**: 辿り着ける。2 行目に `Property '"aria-label"' is missing` と欠けている prop 名が出る。摩擦は 1 行目の `IntrinsicAttributes & PolymorphicProps<"button", ButtonProps>` が情報量ゼロで読み飛ばす必要がある点のみ
- **改善案**: 「なぜ必須なのか」（= `iconOnly` を書いたから）がメッセージのどこにも無い。ただし要求される形が構造として出ているので、`iconOnly` と `aria-label` と `children` が揃った形だと読める。現状でも直し方には到達できるので優先度は低

**改善の経緯**: 以前は `but required in type 'IconButtonProps'.` と表示され、**export していない内部の型名を名指しされて照合先が無い**のが最大の摩擦だった。`DisabledProps` を切り出して `IconButtonProps = DisabledProps & {...}` にしたところ、tsc が交差型の**名前を持たない側**を報告するようになり、型名の代わりに構造が出るようになった。積み残しの「union の分岐型をインライン展開するか」で議論していた課題が、**重複解消の副作用として解決した**。

---

### E-002 | `children` が無い

**書いたコード**

```tsx
<Button iconOnly aria-label="アイコンボタン" />
```

**エラー全文**

```
error TS2322: Type '{ iconOnly: true; "aria-label": string; }' is not assignable to type 'IntrinsicAttributes & PolymorphicProps<"button", ButtonProps>'.
  Property 'children' is missing in type '{ iconOnly: true; "aria-label": string; }' but required in type '{ iconOnly: true; "aria-label": string; children: ReactNode; }'.
```

- **行数**: 2
- **読めるか**: ○
- **利用者は原因に辿り着けるか**: 辿り着ける。E-001 と同じ構造で、`children` は React 標準の概念なので迷わない
- **改善案**: 特になし。優先度低。E-001 と同じく、以前は `IconButtonProps` という内部型名が出ていたが、`DisabledProps` の切り出しにより構造表示に変わった

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
- **改善案**: 「`false` を書く必要はない。省略すればよい」という**次の一手が示されない**。利用者は「では `iconOnly` を消せばいいのか、別の値があるのか」を自分で判断することになる。
  **試したこと**: ヒント型（`iconOnly?: false & { "Omit iconOnly instead of passing false": never }`）を入れると、この行が次のように変わった。

  ```
  error TS2322: Type 'false' is not assignable to type 'true | (false & { "Omit iconOnly instead of passing false": never; })'.
  ```

  prop 名と次の一手が本文に出るようになり、△ の原因は解消した。**それでも採用しなかった**（LEARNING_LOG.md の D-004）。理由は、改善したのが `iconOnly={false}` という起きにくい誤りのほうで、本命の E-004 を賄えなかったこと、および段階 3 で型が膨らむと畳み込みで消える見込みがあること。
  **現状の結論**: このメッセージは据え置き。次の一手は JSDoc 側（D-005）で届ける

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
- **改善案**: これは型の不備ではなく**設計判断（`iconOnly` は変数で渡せない）が型に現れているだけ**なので、メッセージ単体では解決しない。
  **試したこと**: ヒント型（改善案 (2)）を実装した。E-003 と同じ文言がこの行にも出るようになったが、**変数を渡した利用者に必要な助言は「省略しろ」ではなく「要素ごと分岐しろ」**であり、内容が合わなかった。ヒントを置けるのが `false` の分岐だけなので、`boolean` を渡したケースだけ別の文を出すことはできない。**構造上の限界**（D-004）。
  **現状の結論**: エラーメッセージ側での改善を断念し、JSDoc に移した（D-005）。`iconOnly` にホバーすると、条件で出し分けるときの正しい書き方が `@example` として出る。**ただしこれはエラーを見た後に自分でホバーしに行った利用者にしか届かない。** エラーメッセージ単体の評価は △ のまま
  **残る選択肢**: (1) 設計を変えて `boolean` を許す — `false` のとき `aria-label` 必須をどう解除するかという別問題が出る。(3) ドキュメントで示す — 型で防ぐという主張からは後退。段階 3 の後に型サイズを実測し、畳み込みが起きないならヒント型を再検討する

---

### E-005 | `as` を省略してその要素に無い属性を書く

polymorphic 導入で新たに発生するようになった誤り。`as` を書き忘れて `<a>` のつもりで `href` を渡すケース。

**書いたコード**

```tsx
<Button href="/x">text</Button>
```

**エラー全文**

```
error TS2322: Type '{ children: string; href: string; }' is not assignable to type 'IntrinsicAttributes & PolymorphicProps<"button", ButtonProps>'.
  Property 'href' does not exist on type 'IntrinsicAttributes & PolymorphicProps<"button", ButtonProps>'. Did you mean 'ref'?
```

- **行数**: 2
- **読めるか**: ○
- **利用者は原因に辿り着けるか**: 辿り着ける。`PolymorphicProps<"button", ...>` の **`"button"` の部分が、`as` を省略した結果として型引数に現れている**ため、「今は button として扱われている」ことが読み取れる。型引数が表示に出ることが、ここでは利点になっている
- **観察**: `Did you mean 'ref'?` は tsc の類似名サジェストで、**この文脈では誤誘導**。`href` と `ref` は無関係。ライブラリ側では制御できない
- **改善案**: 特になし。優先度低

---

### E-006 | `as` で変えた要素に無い属性を書く

**書いたコード**

```tsx
<Button as="a" href="/x" formAction="/y">text</Button>
```

**エラー全文**

```
error TS2322: Type '{ children: string; as: "a"; href: string; formAction: string; }' is not assignable to type 'IntrinsicAttributes & PolymorphicProps<"a", ButtonProps>'.
  Property 'formAction' does not exist on type 'IntrinsicAttributes & PolymorphicProps<"a", ButtonProps>'.
```

- **行数**: 2
- **読めるか**: ○
- **利用者は原因に辿り着けるか**: 辿り着ける。型引数が `"a"` になっているので、`as` の指定と対応づけられる。**polymorphic が型として機能していることの証拠でもある**
- **改善案**: 特になし。優先度低

**採取例を差し替えた経緯**: 当初は `<Button as="a" href="/x" disabled>` を例にしていた。当時は `disabled` が `<button>` 固有の属性だったためエラーになり、「`as="a"` では `disabled` を渡せないので、無効状態を `disabled` 属性で表現する設計は polymorphic と両立しない」という観察の根拠になっていた。

その後 D-007 で **`disabled` を自前 prop にした**ため、`as` が何であっても受け取れるようになり**このコードはエラーにならなくなった**。同じ「要素に無い属性」を示す例として `formAction`（`<button>` 固有で `<a>` に無い）に差し替えている。

元の観察自体は D-007 の判断根拠として生きているが、**エラーとしては再現しない**。

---

### E-007 | `aria-disabled` を直接書く

`disabled` prop の存在を知らない利用者が自然に書く形。無効状態を ARIA で表現しようとして、ライブラリの入口を通らずに書いてしまうケース。

**書いたコード**

```tsx
<Button aria-disabled>ボタン</Button>
```

**エラー全文**

```
error TS2322: Type '{ children: string; "aria-disabled": true; }' is not assignable to type 'IntrinsicAttributes & PolymorphicProps<"button", ButtonProps>'.
  Type '{ children: string; "aria-disabled": true; }' is not assignable to type 'DisabledProps'.
    Types of property '"aria-disabled"' are incompatible.
      Type 'true' is not assignable to type 'never'.
```

- **行数**: 4
- **読めるか**: ○
- **利用者は原因に辿り着けるか**: 「`aria-disabled` に `true` を入れられない」ことは読める。ただし**代わりに何を書けばいいか（`disabled` prop）は示されない**。`never` という型名から「禁止されている」と読み取るには TypeScript の知識が要る
- **改善案**: 次の一手（`disabled` を使う）が本文に出ない。**JSDoc 側で補う**（D-005 の役割分担）。ヒント型で文章を埋め込む手もあるが、D-004 で却下した理由（型定義の可読性が落ちる、条件型が入ると畳み込みで消える）がここでも当てはまる
- **観察**: `DisabledProps` という **export していない内部の型名**が出ている。E-001 / E-002 が構造表示に変わって解消した問題が、こちらでは新しく発生した。`DisabledProps` は交差型の**名前を持つ側**なので、tsc が名前で報告する。**名前を持つ型を作ると照合先の無い名前が露出する**という関係が、同じファイルの中で対照的に現れている

**この検査に辿り着くまでの経緯**: 当初は `PolymorphicProps` の `Omit` で `"aria-disabled"` を除いていたが、**JSX ではハイフンを含む属性名が余剰プロパティ検査を通過する**ため、型から消しても書けてしまっていた（`data-testid` が `PolymorphicProps` に無くても書けるのと同じルール）。自前 props 側で `"aria-disabled"?: never` と宣言する形に変えて、初めてこのエラーが出るようになった。

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
