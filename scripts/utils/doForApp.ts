import {doForFoldersInFolder} from "./doInFolder";
import {Stats} from "fs";

const appFolders = ["apps", "local"];

export const doForApps = (action: (file: string, stats: Stats, folder: string) => void) => {
    appFolders.forEach(folder => {
        doForFoldersInFolder(folder, action);
    });
};

export const doForApp = (app: string, action: (stats: Stats, folder: string) => void) => {
    doForApps((file: string, stats: Stats, folder: string) => {
        if (file === app) {
            action(stats, folder)
        }
    });
};
