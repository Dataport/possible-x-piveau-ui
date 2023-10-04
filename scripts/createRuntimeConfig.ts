import fs, {Stats} from "fs";
// import {doForAppConfig} from "./utils/doForAppConfig";
import { readFile } from 'fs/promises';
import esprima from 'esprima';

const app = process.argv[2] || 'modules-demo';

export const createRuntimeConfig = async (app: string, appStats: Stats, folder: string) => {
    const userConfigSample = `./${folder}/${app}/config/user-config.sample.js`;
    // import(userConfigSample).then(module => {
    //     console.log("YEA", module);
    // }).catch((error) => console.log("Error!", error));
    const content = await readFile(userConfigSample, 'utf-8');
    const glueConfigAssignment = (content.substring(content.indexOf("glueConfig")));
    const glueConfigContent = (glueConfigAssignment.substring(glueConfigAssignment.indexOf("{")));
    return esprima.tokenize(glueConfigAssignment)
    // return eval(glueConfigContent)
    // return glueConfigContent;
    // const uncommented = glueConfigContent.replace(/[^:]\/{2}.*\n/g, "");
    // const quotedGlueConfigContent = uncommented.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');
    // return JSON.parse(quotedGlueConfigContent);
    // return quotedGlueConfigContent.substring(35, 100)
};

// doForAppConfig(app, (app: string, stats: Stats, folder: string) => {
//     createRuntimeConfig(app, stats, folder).then(result => {
//         console.log("RESULT", result)
//     });
// });

// Assuming we start in content at given position with a curly brace, indicating a stringified Javascript object,
// parses through that string and returns an object containing the same keys and string values coding
// the nested keys.
const transform = (content: string, position: number, prefix: string) => {
    ++position; // Get past '{'
    let next, char, valueRead;
    const result = {};
    while (true) {
        next = content.search(/\w}]/);
        char = content.charAt(position);
        if (char === '}') {
            return { result, position };
        } else if (/\w/.test(char)) {
            const end = content.substring(next).search(/\W/);
            const key = content.substring(next, end);
            position = end;
            const colon = content.substring(position).search(/:/);
            if (colon === -1) {
                console.error(`No colon after key found at position ${position}!`);
                break;
            } else {
                ++position; // Get past ':'
                valueRead = false;
                // TODO
                // do {
                //     next = content.substring(position).search(/\S/); // Next non whitespace
                //     char = content.charAt(next);
                //     if (char === '\\' && content.charAt(next + 1) === '\\') { // Get past a comment
                //
                //     }
                //     if (char === '\'') {
                //         valueRead = true;
                //     } else if (char === '"') {
                //         valueRead = true;
                //     } else if (char === '{') {
                //
                //     }
                // }
            }
        } else {
            console.error(`Expected a key at between positions ${position} and ${next}!`);
            break;
        }
    }
    return {}
}

/**
 * Starting past the opening curly braces, using a tokenization array
 * @param prefix
 */
function readConfigObject(tokenization: [{type: string, value: string}], tokenPosition: number, prefix: string) {
    const result = {};
    while (true) {
        const identifer = tokenPosition[tokenization].value;
    }
}
