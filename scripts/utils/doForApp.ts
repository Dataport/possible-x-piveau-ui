import {doForFoldersInFolder, FilesAction} from "./doInFolder";
import {existsSync, Stats} from "fs";

const appFolders = ["apps", "local"];

// Do an action for all apps
export const doForApps = (action: FilesAction) => {
    doForFoldersInFolder(appFolders, (file: string, stats: Stats, folder: string) => {
        const packageFileName = `${folder}/${file}/package.json`;
        if (existsSync(packageFileName)) {
            action(file, stats, folder);
        }
    });
};

// Do an action for a specific app
export const doForApp = (app: string, action: (stats: Stats, folder: string) => void) => {
    doForApps((file: string, stats: Stats, folder: string) => {
        if (file === app) {
            action(stats, folder)
        }
    });
};
