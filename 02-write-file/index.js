const fs = require('fs');
const path = require('path');
const readline = require('readline');

const writeStream = fs.createWriteStream(
  path.resolve(__dirname, './text.txt')
);
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

readlineInterface.setPrompt('Enter string (or type "exit" for exit): ');

readlineInterface.on('line', (line) => {
  if (line.trim() === 'exit') {
    readlineInterface.close();
    return;
  }

  writeStream.write(`${line}\n`);
});
readlineInterface.on('SIGINT', readlineInterface.close);

readlineInterface.on('close', () => {
  process.stdout.write('\nProcess exit with code 0. Goodbye :)\n');
});


readlineInterface.prompt();