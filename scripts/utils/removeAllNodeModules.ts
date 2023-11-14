import fs from "fs";
import {doInWorkspaces} from "./doInWorkspaces";

fs.rmSync("package-lock.json", { force: true });
doInWorkspaces((file, stats, folder) => {
    const fullPath = `${folder}/${file}/node_modules`
    console.log("Removing", fullPath, "...");
    fs.rmSync(fullPath, { recursive: true, force: true });
}).then(() => {
    console.log("Removing root level node_modules ...");
    fs.rmSync("node_modules", { recursive: true, force: true });
});
