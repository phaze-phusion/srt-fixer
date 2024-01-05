/* eslint-env commonjs */
/* globals Buffer, __dirname */
const fs = require('fs');
const path = require('path');
const npmPackage = require(path.resolve(__dirname, './package.json'));

const buildCommentTemplate = 'TIX Clock v%VERSION, %DATE';
const zeroPad = value => value < 10 ? ('0' + value) : value;

function getDateTime() {
  const date = new Date();
  const YYYY = date.getFullYear();
  const MM = zeroPad(date.getMonth() + 1);
  const DD = zeroPad(date.getDate());
  const hh = zeroPad(date.getHours());
  const mm = zeroPad(date.getMinutes());
  return `${YYYY}-${MM}-${DD} ${hh}:${mm}:00`;
}

// Compile the build comment with the current app version and timestamp
const buildCommentContent = buildCommentTemplate.replace('%VERSION', npmPackage.version).replace('%DATE', getDateTime());
const buildComment = Buffer.from(`/*! ${buildCommentContent} */\n`);

function prepareDist(extension) {
  const outFile = `dist/${npmPackage.name}.min.${extension}`;
  const content = fs.readFileSync(outFile);
  const outStream = fs.openSync(outFile, 'w+');
  fs.writeSync(outStream, buildComment);
  fs.writeSync(outStream, content);
  fs.close(outStream, err => {
    if (err) throw err; else console.info('\x1b[36m+ ${outFile}\x1b[0m');
  });
}

// Write copyright header to CSS file
prepareDist('css');

// Write copyright header to JS file
prepareDist('js');
