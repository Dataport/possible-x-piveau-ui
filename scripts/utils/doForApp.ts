import {doForFoldersInFolder, FilesAction} from "./doInFolder";
import {Stats} from "fs";

const appFolders = ["apps", "local"];

// Do an action for all apps
export const doForApps = (action: FilesAction) => {
    doForFoldersInFolder(appFolders, action);
};

// Do an action for a specific app
export const doForApp = (app: string, action: (stats: Stats, folder: string) => void) => {
    doForApps((file: string, stats: Stats, folder: string) => {
        if (file === app) {
            action(stats, folder)
        }
    });
};
