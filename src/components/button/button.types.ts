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
}

/** 通常のテキストボタン */
type BaseButtonProps = {
    /** 通常のボタンでは指定不可 */
    iconOnly?: never
    /** ボタンのラベル文字列 */
    children: ReactNode
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