const fs = require('fs');
const path = require('path');

const targetFolderPath = path.resolve(__dirname, './secret-folder/');

fs.readdir(
  targetFolderPath,
  {
    withFileTypes: true
  },
  (err, files) => {
    files.forEach(file => {
      fs.stat(path.resolve(targetFolderPath, file.name), (err, stats) => {
        const fileName = path.parse(file.name).name;
        const fileExt = path.parse(file.name).ext.replace('.', '');
        const fileSize = stats.size;

        if (stats.isFile())
          console.log(`${fileName} - ${fileExt} - ${
            (fileSize / 1024).toFixed(2)}KB`
          );
      });
    });
  }
);