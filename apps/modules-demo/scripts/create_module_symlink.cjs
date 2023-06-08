const fs = require('fs');
const target = './node_modules/@piveau/piveau-hub-ui-modules';

try {
  fs.symlinkSync("../../src/modules/", target, "dir");
  console.log("Module symlink created in node_modules");
} catch(ex) {
  console.error("Failed to create symlink in node_modules.")
  if (process.platform === "win32") { // Operating under MS Windows
    console.error("You need to execute this script as ADMIN.");
  }
}



