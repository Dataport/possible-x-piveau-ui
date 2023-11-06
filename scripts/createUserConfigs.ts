// Create user-config.js files for all the apps, if they don't yet exist

// @ts-ignore
import fs, {Stats} from "fs";
import {doForApps} from "./utils/doForApp";

doForApps((app, appStats, folder) => {
    const userConfigSample = `${folder}/${app}/config/user-config.sample.js`;
    const userConfig = `${folder}/${app}/config/user-config.js`;
    if (fs.existsSync(userConfigSample)) {
        if (fs.existsSync(userConfig)) {
            console.log(userConfig, "already existing")
        } else {
            fs.copyFile(userConfigSample, userConfig, (error: NodeJS.ErrnoException | null) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log("Created", userConfig);
                }
            });
        }
    }
});




