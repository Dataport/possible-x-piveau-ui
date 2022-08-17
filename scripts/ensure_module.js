const fs = require('fs');
const target = './node_modules/@piveau/piveau-hub-ui-modules';

if ( ! fs.existsSync(target)) {
  if (process.platform !== "win32") { // Not operating under MS Windows
    fs.symlinkSync("../../src/modules/", target, "dir");
  } else {
    console.error("Please either run localinstall or run link-module as admin or copy a symlink to the modules folder into node_modules\\@piveau\\piveau-hub-ui-modules.");
  }
}


