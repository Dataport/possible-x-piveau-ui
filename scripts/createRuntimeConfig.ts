import {doForApp} from "./utils/doForApp";
import {Stats} from "fs";

const app = process.argv[2] || 'modules-demo';

doForApp(app, (stats: Stats, folder: string) => {
    console.log(app, folder);
});
