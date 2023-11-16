import fs, {Stats} from "fs";

export type FilesAction = (file: string, stats: Stats, folder: string) => void;

// Do an action for all contents of a folder
export const doInFolder = (folder: string | string[], action: FilesAction) => {
    if (typeof folder === 'string') {
        fs.readdir(folder, (error: NodeJS.ErrnoException | null, files: string[]) => {
            if (error) {
                console.error(error);
            } else {
                files.forEach(file => {
                    fs.stat(`${folder}/${file}`, function (error: NodeJS.ErrnoException | null, stats: Stats) {
                        if (error) {
                            console.error(error);
                        } else {
                            action(file, stats, folder);
                        }
                    });
                });
            }
        });
    } else if (folder && folder.length) {
        folder.forEach(item => {
            doInFolder(item, action);
        })
    }
};

// Do an action for all folders in a given folder
export const doForFoldersInFolder = (folder: string | string[], action: (file: string, stats: Stats, folder: string) => void) => {
    doInFolder(folder, (file: string, stats: Stats, folder: string) => {
        if (stats.isDirectory()) {
            action(file, stats, folder);
        }
    });
};
