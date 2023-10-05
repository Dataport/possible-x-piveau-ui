import { execSync } from 'child_process';
const arg = process.argv[2] || 'vanilla-piveau-hub-ui';
execSync('npm run prepare-dev -w @piveau/piveau-hub-ui-modules', {stdio:[0, 1, 2]});
execSync('npm run serve -w ' + arg, {stdio:[0, 1, 2]});
