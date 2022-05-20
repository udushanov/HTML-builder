const path = require('path');
const fs = require('fs');
const stylesPath = path.join(__dirname, 'styles')

function createBundleCss() {
    const writeStream = fs.createWriteStream(
        path.join(__dirname, 'project-dist', 'bundle.css'), {
        flags: 'w'
    })

    const destPath = path.join(__dirname, 'project-dist', 'bundle.css')

    fs.readdir(stylesPath, {withFileTypes: true}, (err, files)  => {
        if (err) {
            console.log(err);
        } else {
            files.forEach(file => {
                const filePath = path.join(stylesPath, file.name);
                const fileExtension = path.parse(filePath).ext;

                fs.stat(filePath, (err, stat) => {
                    if (err) console.log(err);

                    if (stat.isFile() && fileExtension === '.css') {
                        fs.readFile(filePath, 'utf8', (err, fileContent) => {
                            if (err) console.log(err);

                            let toWrite = fileContent + '\n';

                            fs.appendFile(destPath, toWrite, (err) => {
                                if (err) console.log(err);
                            })
                        })
                    }
                })
            })
        }
    })

    writeStream.end();
}

createBundleCss();