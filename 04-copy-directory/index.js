const path = require('path');
const pathFilesFolder = path.join(__dirname, 'files');
const pathFilesCopyFolder = path.join(__dirname, 'files-copy');
const { rm, mkdir, readdir, copyFile } = require('fs/promises');

async function copyDir(src, dest) {
  await rm(dest, { recursive: true, force: true });
  const entries = await readdir(src, { withFileTypes: true });
  await mkdir(dest, { recursive: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

copyDir(pathFilesFolder, pathFilesCopyFolder);
console.log('Files created succesfully')
