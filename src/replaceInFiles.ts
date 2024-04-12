import fs from "fs-extra";
import { join, relative } from "path";
export interface ReplacementData {
    sourceFolder: string;
    targetFolder: string;
    callback: (s: string) => string;
}

export class ReplacementInstance {
    constructor(public readonly d: ReplacementData) {}

    replaceInFiles(relPath: string = ""): void {
        const sourcePath = join(this.d.sourceFolder, relPath);
        const sourcePaths = fs.readdirSync(sourcePath, {
            withFileTypes: true,
        });
        for (const sourcePath of sourcePaths) {
            const subRelPath = join(relPath, sourcePath.name);
            const { sourceFullPath, targetFullPath } = this.getAbsPaths(subRelPath);
            if (sourcePath.isDirectory()) {
                fs.ensureDirSync(targetFullPath);
                this.replaceInFiles(subRelPath);
            } else {
                this.replaceInFile(subRelPath);
            }
        }
    }

    replaceInFile(relPath: string): void {
        const { sourceFullPath, targetFullPath } = this.getAbsPaths(relPath);
        const s = fs.readFileSync(sourceFullPath, "utf8");
        const modifiedContent = this.d.callback(s);
        fs.outputFileSync(targetFullPath, modifiedContent);
    }

    toRelPath(absSourcePath: string): string {
        const { sourceFolder } = this.d;
        return relative(sourceFolder, absSourcePath);
    }

    getAbsPaths(relPath: string): {
        sourceFullPath: string;
        targetFullPath: string;
    } {
        const { sourceFolder, targetFolder } = this.d;
        const sourceFullPath = join(sourceFolder, relPath);
        const targetFullPath = join(targetFolder, relPath);
        return {
            sourceFullPath,
            targetFullPath,
        };
    }

    close() {
        // TODO close
    }
}
