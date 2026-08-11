export function mergeClassNames(...classNames: (string | undefined)[]): string | undefined {
    const mergedClassNames = classNames.filter(className => className).join(" ");
    return mergedClassNames.length > 0 ? mergedClassNames : undefined;
}