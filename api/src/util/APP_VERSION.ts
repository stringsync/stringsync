import fs from 'fs';
import path from 'path';

const packageJsonPath = path.join(__dirname, '..', '..', 'package.json');
const packageJsonBuffer = fs.readFileSync(packageJsonPath, 'utf-8');
const packageJson = JSON.parse(packageJsonBuffer);

export const APP_VERSION = packageJson.version;
