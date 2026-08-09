import type { ComponentPropsWithRef, ReactNode } from "react"

type IconButtonProps = {
    iconOnly: true
    "aria-label": string
    children: ReactNode
}

type BaseButtonProps = {
    iconOnly?: never
    children: ReactNode
}

/**
 * ボタンコンポーネントのProps定義。
 * `iconOnly` の指定有無によって、必須となるプロパティが変化します。
 * 
 * @example 通常のテキストボタン（children のみ）
 * ```tsx
 * <Button>送信する</Button>
 * ```
 * 
 * @example アイコンのみのボタン（aria-label が必須）
 * ```tsx
 * <Button iconOnly aria-label="検索する">
 *   <SearchIcon />
 * </Button>
 * ```
 */
export type ButtonProps = ComponentPropsWithRef<"button"> & (IconButtonProps | BaseButtonProps)