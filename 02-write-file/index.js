const process = require('process');
const path = require('path');
const fs = require('fs');
const filePath = path.join(__dirname, 'text.txt');
const readline = require('readline');

const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });

const writable = fs.createWriteStream(filePath);

process.stdout.write('Hi! Input some text. Type "exit" or press "ctrl + c" for exit.\n');

rl.on('line', (line) => {
  line === 'exit' && exit();
  writable.write(line + '\n');
}).on('close', exit);

process.on('SIGINT', exit);

function exit() {
  process.stdout.write('Good bye!');
  process.exit();
}