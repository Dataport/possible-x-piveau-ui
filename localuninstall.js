const fs = require('fs');
const target = './node_modules/@piveau/piveau-hub-ui-modules';

if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true })
}

console.log("Removed package from node_modules");
