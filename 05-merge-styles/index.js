const fs = require('fs');
const path = require('path');

const sourceFilesPath = path.resolve(__dirname, './styles');
const writeStream = fs.createWriteStream(
  path.resolve(__dirname, './project-dist', 'bundle.css'),
  'utf-8'
);

/**
 * @param {string} path
 * @returns {Promise<string>}
 */
const readTextFileData = (path) => {
  return new Promise(resolve => {
    let data = '';
    const readStream = fs.createReadStream(path, 'utf-8');

    readStream.on('data', (chunk) => {
      data += chunk.toString();
    });

    readStream.on('end', () => {
      resolve(data);
    });
  });
};


fs.readdir(
  sourceFilesPath,
  {
    withFileTypes: true
  },
  (err, files) => {
    files.forEach(async file => {
      if (file && path.extname(file.name) === '.css') {
        const str = await readTextFileData(
          path.resolve(sourceFilesPath, file.name)
        );
        writeStream.write(`${str}\n`);
      }
    });
  }
);