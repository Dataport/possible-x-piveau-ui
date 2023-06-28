import fs from "fs";

// Create user-config.js files for all the apps, if they don't yet exist
fs.readdir('apps', (error, files) => {
    if (error) {
        console.error(error);
    } else {
        files.forEach(file => {
            fs.stat(`apps/${file}`, function (error, stats) {
                if (error) {
                    console.error(error);
                } else {
                    if (stats.isDirectory()) {
                        fs.stat(`apps/${file}/config`, function (error, stats) {
                            if (error) {
                                console.error(error);
                            } else {
                                if (stats.isDirectory()) {
                                    const userConfigSample = `apps/${file}/config/user-config.sample.js`;
                                    const userConfig = `apps/${file}/config/user-config.js`;
                                    if (fs.existsSync(userConfigSample)) {
                                        if (fs.existsSync(userConfig)) {
                                            console.log(userConfig, "already existing")
                                        } else {
                                            fs.copyFile(userConfigSample, userConfig, (error) => {
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
