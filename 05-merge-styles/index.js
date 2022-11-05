const fs = require('fs');
const path = require('path');

const sourceFilesPath = path.resolve(__dirname, './styles');
const writeStream = fs.createWriteStream(
  path.resolve(__dirname, './project-dist', 'bundle.css')
);

fs.readdir(
  sourceFilesPath,
  {
    withFileTypes: true
  },
  (err, files) => {
    files.forEach(file => {
      if (file && path.extname(file.name) === '.css')
        fs.createReadStream(path.resolve(sourceFilesPath, file.name))
          .pipe(writeStream, { end: false });
    });
  }
);