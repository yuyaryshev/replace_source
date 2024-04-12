import { watch } from "chokidar";
import { toLinuxPathLowerCase, toRelativePathOrKeep } from "ystd";
export interface WatchFilesInput {
    replacementsFile: string;
    sourcePath: string;
    onRefreshOne: (pathToSourceFile: string) => void;
    onRefreshAll: () => void;
}
export function watchFiles(inp: WatchFilesInput) {
    let watcher: any | undefined;
    function log(...args: any[]) {
        // console.log(`CODE00001562 ConverterService.log:`, ...args);
    }
    function start() {
        let watcher = watch([inp.replacementsFile, inp.sourcePath], {
            ignored: /(^|[\/\\])\../,
            // ignore dotfiles
            persistent: true,
        });
        watcher
            .on("add", (absolutePath: string) => {
                inp.onRefreshOne(absolutePath);
            })
            .on("unlink", (path: string) =>
                log(`CODE00001593 File ${path} has been removed`),
            )
            .on("unlinkDir", (path: string) =>
                log(`CODE00001595 Directory ${path} has been removed`),
            )
            .on("error", (error: string) =>
                log(`CODE00001596 Watcher error: ${error}`),
            )
            // .on("addDir", (path: string) => log(`CODE00001594 Directory ${path} has been added`))
            // .on("ready", () => log(`CODE00001597 Initial scan complete. Ready for changes`))
            .on("raw", (event: any, path: string, details: any) => {
                // internal
                log(`CODE00001598 Raw event info:`, event, path, details);
            })

            // 'add', 'addDir' and 'change' events also receive stat() results as second
            // argument when available: https://nodejs.org/api/fs.html#fs_class_fs_stats
            .on("change", (path: string, stats: any) => {
                if (path === inp.replacementsFile) {
                    inp.onRefreshAll();
                } else {
                    inp.onRefreshOne(path);
                }
            });
    }
    async function stop() {
        await watcher?.close();
    }
    return {
        start,
        stop,
    };
}
