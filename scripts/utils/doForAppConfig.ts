import fs, {Stats} from "fs";
import {doForApp, doForApps} from "./doForApp";

const appConfigAction = (app: string, folder: string, action: (app: string, stats: Stats, folder: string) => void) => {
    fs.stat(`${folder}/${app}/config`, function (error: NodeJS.ErrnoException | null, stats: Stats) {
        if (error) {
            console.error(error);
        } else {
            if (stats.isDirectory()) {
                action(app, stats, folder);
            }
        }
    });
};

// Do and action inside an app's config folder
export const doForAppConfig = (app: string, action: (app: string, appStats: Stats, folder: string) => void) => {
    doForApp(app, (stats: Stats, folder: string) => {
        appConfigAction(app, folder, action);
    });
};

// Do an action in all app's config folders
export const doForAllAppConfigs = (action: (app: string, appStats: Stats, folder: string) => void) => {
    doForApps(action);
}
