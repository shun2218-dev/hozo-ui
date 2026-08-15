import type { ReactNode } from "react"

/** アイコンのみのボタン */
type IconButtonProps = {
    /** 
     * 必要な時だけ記述する  
     * 出し分けをする際は要素ごと分岐する
     * 
     * @example
     * 出し分けを行う場合
     * ```tsx
     * {
     *   isIcon ? (
     *     <Button iconOnly aria-label="検索する">
     *       <SearchIcon />
     *     </Button>
     *   ) : (
     *     <Button>送信する</Button>
     *   )
     * }
     * ```
     */
    iconOnly: true
    /** `iconOnly` が `true` の場合 `aria-label` アクセシビリティ対策により必須 */
    "aria-label": string
    /** アイコン要素を渡す */
    children: ReactNode
    /**
     * ネイティブの `disabled` 属性ではなく `aria-disabled` で表現する。
     * フォーカスは受け取れるまま残るため、支援技術の利用者もボタンの存在に気づける。
     *
     * `as="a"` のときは `href` を外し、`role` と `tabIndex` を補う。
     * リンクとしての遷移が起きなくなる。
     *
     * `as` に関数コンポーネントを渡した場合、この処理は働かない（`href` が残る）。
     *
     * @example
     * 送信中だけ無効にする
     * ```tsx
     * <Button disabled={isSubmitting}>送信する</Button>
     * ```
     */
    disabled?: boolean
}

/** 通常のテキストボタン */
type BaseButtonProps = {
    /** 通常のボタンでは指定不可 */
    iconOnly?: never
    /** ボタンのラベル文字列 */
    children: ReactNode
    /**
     * ネイティブの `disabled` 属性ではなく `aria-disabled` で表現する。
     * フォーカスは受け取れるまま残るため、支援技術の利用者もボタンの存在に気づける。
     *
     * `as="a"` のときは `href` を外し、`role` と `tabIndex` を補う。
     * リンクとしての遷移が起きなくなる。
     *
     * `as` に関数コンポーネントを渡した場合、この処理は働かない（`href` が残る）。
     *
     * @example
     * 送信中だけ無効にする
     * ```tsx
     * <Button disabled={isSubmitting}>送信する</Button>
     * ```
     */
    disabled?: boolean
}

/**
 * ボタンコンポーネントのProps定義。
 * `iconOnly` の指定有無によって、必須となるプロパティが変化します。
 * 
 * @example
 * 通常のテキストボタン（children のみ）
 * ```tsx
 * <Button>送信する</Button>
 * ```
 * 
 * @example
 * アイコンのみのボタン（aria-label が必須）
 * ```tsx
 * <Button iconOnly aria-label="検索する">
 *   <SearchIcon />
 * </Button>
 * ```
 */
export type ButtonProps = IconButtonProps | BaseButtonProps