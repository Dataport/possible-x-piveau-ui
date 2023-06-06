import lnk from 'lnk';
import fs from 'fs';
import path from 'path';

if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
}
fs.mkdirSync('dist', { recursive: true });
fs.readdir('lib', (error, files) => {
   files.forEach(file => {
       fs.stat(path.join('lib', file), (error, stat) => {
           //console.log(file, stat.isFile());
           lnk(`lib/${file}`,'dist');
       });
   });
});
fs.writeFile('dist/piveau-hub-ui-modules.css', '/* Just a placeholder file in development mode */', error => {
    if (error) console.log(error);
});
