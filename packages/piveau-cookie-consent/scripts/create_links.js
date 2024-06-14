// Creates a dist folder with links to the contents of the lib folder
// to allow a development workflow with consuming apps in the monorepo.

import lnk from 'lnk';
import fs from 'fs';


// Ensure a clean dist folder
if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
}
fs.mkdirSync('dist', { recursive: true });


// Create links to the contents of lib
fs.readdir('lib', (error, files) => {
    if (error) {
        console.error(error);
    } else {
       files.forEach(file => {
           lnk(`lib/${file}`,'dist');
       });
    }
});

// Add a placeholder css file
const fileContent = '/* Just a placeholder file in development mode */';
fs.writeFile('dist/piveau-cookie-consent.css', fileContent, error => {
    if (error) console.error(error);
});
