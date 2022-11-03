const fs = require('fs');
const path = require('path');

const copyFile = (fromPath, toPath) => {
  fs.rm(toPath, {
    recursive: true
  }, () => {
    fs.mkdir(toPath, () => {
      fs.readdir(fromPath,
        {
          withFileTypes: true
        },
        (err, files) => {
          files.forEach((file) => {
            const writeStream = fs.createWriteStream(
              path.resolve(toPath, file.name)
            );
            const readStream = fs.createReadStream(
              path.resolve(fromPath, file.name)
            );

            readStream.pipe(writeStream);
          });
        });
    });
  });
};

copyFile(
  path.resolve(__dirname, 'files'),
  path.resolve(__dirname, 'file-copy')
);