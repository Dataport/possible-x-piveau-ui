import fs, {Stats} from "fs";
import {readFile} from "fs/promises";
import {doForFoldersInFolder, FilesAction} from "./doInFolder";

/**
 * Look into the root package.json for all workspaces and execute a given action in all of them
 * @param action
 */
export const doInWorkspaces = async (action: FilesAction) => {
    const workspaces: string[] = JSON.parse(await readFile("./package.json", 'utf-8')).workspaces;
    workspaces.forEach(workspace => {
        if (workspace.endsWith("/*")) {
            workspace = workspace.substring(0, workspace.length - 2);
            doForFoldersInFolder(workspace, (file, stats, folder) => {
                action(file, stats, folder);
            })
        } else {
            fs.stat(workspace, function (error: NodeJS.ErrnoException | null, stats: Stats) {
                if (error) {
                    console.error(error);
                } else {
                    const separator = workspace.lastIndexOf("/");
                    const file = workspace.substring(separator + 1);
                    const folder = workspace.substring(0, separator);
                    action(file, stats, folder);
                }
            });
        }
    })
};

