const fs = require('fs');
const path = require("path");
const target = './node_modules/@piveau/piveau-hub-ui-modules';

/**
 * Copies The contents of a source directory into a target directory; creates the target
 * directory if necessary.
 * @param src
 * @param dest
 */
const copyRecursiveSync = function(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(function(childItemName) {
            copyRecursiveSync(path.join(src, childItemName),
                path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
};

copyRecursiveSync('./dist', target + '/dist');
fs.copyFileSync('./package.json', target + '/package.json');
fs.copyFileSync('./README.md', target + '/README.md');

console.log("Bundled module copied to node_modules");
