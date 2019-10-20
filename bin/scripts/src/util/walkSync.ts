import * as fs from 'fs';
import * as path from 'path';

export const walkSync = (dir: string): string[] => {
  const files = fs.readdirSync(dir);

  let list: string[] = [];
  for (const file of files) {
    const absFile = path.resolve(dir, file);
    if (fs.statSync(absFile).isDirectory()) {
      list = [...list, ...walkSync(absFile)];
    } else {
      list.push(absFile);
    }
  }

  return list;
};
