import {doInWorkspaces} from "./doInWorkspaces";
import {readFileSync, Stats} from "fs";

/**
 * Given a workspace name, return the path in the file structure for it
 * @param name
 */
export async function pathByWorkspaceName(name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        doInWorkspaces((file: string, stats: Stats, folder: string) => {
            const path = `${folder}/${file}`
            const workspaceName: string = JSON.parse(readFileSync(`./${path}/package.json`, 'utf-8')).name;
            if (name === workspaceName) {
                resolve(path);
            }
        });
    });
}

