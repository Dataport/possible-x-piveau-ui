import {doInWorkspaces} from "./doInWorkspaces";
import {readFileSync, existsSync, Stats} from "fs";

/**
 * Given a workspace name, return the path in the file structure for it
 * @param name
 */
export async function pathByWorkspaceName(name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        doInWorkspaces((file: string, stats: Stats, folder: string) => {
            const path = `${folder}/${file}`
            const packageFileName = `./${path}/package.json`;
            if (existsSync(packageFileName)) {
                const workspaceName: string = JSON.parse(readFileSync(packageFileName, 'utf-8')).name;
                if (name === workspaceName) {
                    resolve(path);
                }
            }
        });
    });
}

