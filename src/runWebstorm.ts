import { exec } from "child_process";
export function runWebstorm(left: string, right: string): void {
    const command = `D:\\ProgsReady\\Webstorm_2023_3_1\\WebStorm2023.3\\bin\\webstorm64.exe diff "${left}" "${right}"`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        // console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
}
