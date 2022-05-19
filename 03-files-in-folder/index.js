const fs = require('fs');
const path = require('path');
const pathTestFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathTestFolder, { withFileTypes: true }, (err, files) => {
  console.log('');
  if (err) console.log(err);
  else {
    files.forEach((file) => {
      const fullPathFile = path.join(pathTestFolder, file.name);
      const name = path.parse(fullPathFile).name;
      const ext = path.parse(fullPathFile).ext.slice(1);

      fs.stat(fullPathFile, function (err, stat) {
        if (err) console.log(err);

        const isFile = stat.isFile();

        if (isFile) {
          const size = (stat.size)/1000;
          console.log(`${name} - ${ext} - ${size}kb`);
        }
      });
    });
  }
});