// Create user-config.js files for all the apps, if they don't yet exist

// @ts-ignore
import fs, {Stats} from "fs";

const scanFolder = (folder: string) => {
    fs.readdir(folder, (error: NodeJS.ErrnoException | null, files: string[]) => {
        if (error) {
            console.error(error);
        } else {
            files.forEach(file => {
                fs.stat(`${folder}/${file}`, function (error: NodeJS.ErrnoException | null, stats: Stats) {
                    if (error) {
                        console.error(error);
                    } else {
                        if (stats.isDirectory()) {
                            fs.stat(`${folder}/${file}/config`, function (error: NodeJS.ErrnoException | null, stats: Stats) {
                                if (error) {
                                    console.error(error);
                                } else {
                                    if (stats.isDirectory()) {
                                        const userConfigSample = `${folder}/${file}/config/user-config.sample.js`;
                                        const userConfig = `${folder}/${file}/config/user-config.js`;
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
                                    }
                                }
                            });
                        }
                    }
                });
            });
        }
    });
};

const folders = ["apps", "local"];

folders.forEach(folder => {
    scanFolder(folder);
});
