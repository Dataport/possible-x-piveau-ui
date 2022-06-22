const fs = require('fs');
const target = './node_modules/@piveau/piveau-hub-ui-modules';

if ( ! fs.existsSync(target)) {
  fs.symlinkSync("../../src/modules/", target, "dir");
}


