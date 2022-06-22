const fs = require('fs');
const target = './node_modules/@piveau/piveau-hub-ui-modules';

fs.symlinkSync("../../src/modules/", target, "dir");
console.log("Module symlink created in node_modules");


