const fs = require('fs');
const target = './node_modules/@piveau/piveau-hub-ui-modules';

if (fs.existsSync(target)) {
  fs.rmSync(target, { recursive: true, force: true })
  console.log("Removed piveau-hub-ui-modules from node_modules");
}

