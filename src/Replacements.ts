export type RegExpPair = [RegExp, string]; // from, to

export interface ReplacementsInput {
    sourcePath?: string;
    targetPath?: string;
    strs?: string; // from[tab from tab from] tab to
    regexps?: RegExpPair[];
    func?: (s: string) => string;
}
export interface ReplacementsOverrides {
    sourcePathOverride?: string;
    targetPathOverride?: string;
}
export interface Replacements {
    sourcePath?: string;
    targetPath?: string;
    strs?: string[][]; // Array of [from, from, from, to]
    regexps?: RegExpPair[];
    func?: (s: string) => string;
}
export function normalizeReplacements(
    replacementsInput: ReplacementsInput,
): Replacements {
    const strs: string[][] =
        replacementsInput.strs
            ?.trim()
            .split("\n")
            .map((ss) =>
                ss
                    .split(" ")
                    .map((sss) => sss.trim())
                    .filter((s) => s.length),
            ) || [];
    return {
        ...replacementsInput,
        strs,
    };
}
