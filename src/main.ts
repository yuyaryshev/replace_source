import {
    Replacements,
    ReplacementsInput,
    ReplacementsOverrides,
} from "./Replacements";
import { ReplacementData, ReplacementInstance } from "./replaceInFiles";
import { doReplace } from "./doReplace";
import fs from "fs-extra";
import { runMeld } from "./runMeld";
import { watchFiles } from "./watchFiles";
import { runWebstorm } from "./runWebstorm";
export function cmdReplace(
    replacementsFile: string,
    overrides?: ReplacementsOverrides,
) {
    let firstRun = true;
    let replacementInstance: ReplacementInstance | undefined;
    let stopWatch: () => void = () => {};
    function restartReplacementInstance() {
        const replacements0: any = require(replacementsFile);
        const replacements1 = replacements0.default || replacements0;
        const replacements: ReplacementsInput = Object.assign(
            replacements1,
            overrides,
        );
        if (!replacements.sourcePath) {
            throw new Error(`CODE00000001 sourcePath is undefined!`);
        }
        if (!replacements.targetPath) {
            throw new Error(`CODE00000002 tempPath is undefined!`);
        }
        stopWatch();
        if (replacementInstance) {
            replacementInstance.close();
        }
        fs.emptyDirSync(replacements.targetPath);
        const d: ReplacementData = {
            sourceFolder: replacements.sourcePath,
            targetFolder: replacements.targetPath,
            callback: (s: string) => doReplace(s, replacements),
        };
        replacementInstance = new ReplacementInstance(d);
        replacementInstance.replaceInFiles();
        if (firstRun) {
            console.log(`CODE00001563 replace_source is started`);
            console.log(`CODE00001564    replacementsFile=${replacementsFile}`);
            console.log(
                `CODE00001565    sourcePath=${replacements.sourcePath}`,
            );
            console.log(
                `CODE00001566    targetPath=${replacements.targetPath}`,
            );
            // runWebstorm(replacements.targetPath, replacements.sourcePath);
            // runMeld(replacements.targetPath, replacements.sourcePath);
        }
        firstRun = false;
        const { start, stop } = watchFiles({
            replacementsFile: replacementsFile,
            sourcePath: replacements.sourcePath,
            onRefreshOne: (pathToSourceFile: string) => {
                const relPath =
                    replacementInstance!.toRelPath(pathToSourceFile);
                replacementInstance!.replaceInFile(relPath);
            },
            onRefreshAll: restartReplacementInstance,
        });
        stopWatch = stop;
    }
    restartReplacementInstance();
}
export function main() {
    cmdReplace(
        `D:\\b\\Mine\\GIT_Work\\replace_source\\lib\\cjs\\example_migrations.js`,
    );
}
main();
setInterval(() => {}, 1000);
