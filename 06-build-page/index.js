const fs = require('fs');
const path = require('path');
const pathAssetsFolder = path.join(__dirname, 'assets');
const pathProjectDistAssetsFolder = path.join(
  __dirname,
  'project-dist',
  'assets'
);
const { rm, mkdir, readdir, copyFile } = require('fs/promises');
const pathStylesFolder = path.join(__dirname, 'styles');
const pathProjectDistFolder = path.join(__dirname, 'project-dist');
const templateHtml = path.join(__dirname, 'template.html');
const indexHtml = path.join(pathProjectDistFolder, 'index.html');
const components = path.join(__dirname, 'components');

function copyFileTemplate(source, target) {
  return new Promise(function (resolve, reject) {
    let rd = fs.createReadStream(source);
    rd.on('error', rejectCleanup);
    let wr = fs.createWriteStream(target);
    wr.on('error', rejectCleanup);
    function rejectCleanup(err) {
      rd.destroy();
      wr.end();
      reject(err);
    }
    wr.on('finish', resolve);
    rd.pipe(wr);
  });
}

function htmlBuilder() {
  fs.readFile(indexHtml, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    } else {
      fs.readdir(components, { withFileTypes: true }, (err, files) => {
        if (err) console.log(err);

        files.forEach((file) => {
          const fullPathFile = path.join(components, file.name);

          fs.stat(fullPathFile, function (err, stat) {
            if (err) console.log(err);

            const isFile = stat.isFile();

            if (isFile && path.parse(file.name).ext === '.html') {
              const name = path.parse(file.name).name;
              const regexp = new RegExp(`{{${name}}}`);
              const readStream = fs.ReadStream(
                path.join(components, file.name),
                'utf8'
              );
              readStream.on('data', (chunk) => {
                data = data.toString().replace(regexp, chunk);
              });
              readStream.on('end', () => {
                fs.writeFile(indexHtml, data, () => {});
              });
            }
          });
        });
      });
    }
  });
}

function createBundleCss() {
  const stream = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'style.css'),
    {
      flags: 'w',
    }
  );

  const fullPathDest = path.join(__dirname, 'project-dist', 'style.css');

  fs.readdir(pathStylesFolder, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        const fullPathFile = path.join(pathStylesFolder, file.name);
        const ext = path.parse(fullPathFile).ext;

        fs.stat(fullPathFile, function (err, stat) {
          if (err) console.log(err);

          const isFile = stat.isFile();

          if (isFile && ext === '.css') {
            fs.readFile(fullPathFile, 'utf8', function (err, fileContent) {
              if (err) console.log(err);

              let toWrite = fileContent + '\n';

              fs.appendFile(fullPathDest, toWrite, function (err) {
                if (err) console.log(err);
              });
            });
          }
        });
      });
    }
  });

  stream.end();
}

async function copyDir(src, dest) {
  await rm(dest, { recursive: true, force: true });
  const entries = await readdir(src, { withFileTypes: true });
  await mkdir(dest, { recursive: true });
  await mkdir(path.join(__dirname, 'project-dist', 'assets'), {
    recursive: true,
  });

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

try {
  (async () => {
    await copyDir(pathAssetsFolder, pathProjectDistAssetsFolder);
    await createBundleCss();
    await copyFileTemplate(templateHtml, indexHtml);
    await htmlBuilder();
  })();
} catch (err) {
  if (err) console.log(err);
}