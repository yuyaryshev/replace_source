import { normalizeReplacements, ReplacementsInput } from "./Replacements.js";
export function doReplace(
    s: string,
    replacementsInput: ReplacementsInput,
): string {
    const replacements = normalizeReplacements(replacementsInput);
    if (replacements.strs) {
        for (let items of replacements.strs) {
            const to = items.slice(-1)[0];
            for (let i = 0; i < items.length - 1; i++)
                s = s.replaceAll(items[i], to);
        }
    }
    if (replacements.regexps) {
        for (let [regex, replacement] of replacements.regexps) {
            s = s.replace(regex, replacement);
        }
    }
    if (replacements.func) {
        s = replacements.func(s);
    }
    return s;
}
