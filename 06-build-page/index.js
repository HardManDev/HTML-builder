const fs = require('fs');
const path = require('path');

const templateRegex = /\{\{(.*?)\}\}/g;

const stylesPath = path.resolve(__dirname, 'styles');
const componentsPath = path.resolve(__dirname, 'components');
const htmlTemplatePath = path.resolve(__dirname, 'template.html');
const destinationPath = path.resolve(__dirname, 'project-dist');

const mergeHtml = async () => {
  let templateString = await readTextFileData(htmlTemplatePath);
  const writeStream = fs.createWriteStream(
    path.resolve(destinationPath, 'index.html')
  );

  let matchedRegex;
  while ((matchedRegex = templateRegex.exec(templateString)) !== null) {
    const componentHtmlData = await readTextFileData(path.resolve(
      componentsPath,
      `${matchedRegex[1]}.html`
    ));

    templateString = templateString.replace(matchedRegex[0], componentHtmlData);
  }

  writeStream.write(templateString);
};

const mergeStyles = () => {
  const writeStream = fs.createWriteStream(
    path.resolve(destinationPath, 'style.css')
  );

  fs.readdir(
    stylesPath,
    {
      withFileTypes: true
    },
    (err, files) => {
      files.forEach(file => {
        if (file && path.extname(file.name) === '.css')
          fs.createReadStream(path.resolve(stylesPath, file.name))
            .pipe(writeStream, { end: false });
      });
    }
  );
};

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
            if (!file.isFile()) {
              copyFile(
                path.resolve(fromPath, file.name),
                path.resolve(toPath, file.name)
              );
              return;
            }

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

fs.rm(
  destinationPath,
  {
    recursive: true
  },
  () => {
    fs.mkdir(
      destinationPath,
      async () => {
        await mergeHtml();
        mergeStyles();
        copyFile(
          path.resolve(__dirname, 'assets'),
          path.resolve(destinationPath, 'assets')
        );
      }
    );
  }
);