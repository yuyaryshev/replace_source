import { exec } from "child_process";
export function runMeld(left: string, right: string): void {
    const command = `meld.exe "${left}" "${right}"`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        // console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
}
