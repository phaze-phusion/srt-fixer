/* eslint-env commonjs */
/* globals Buffer, __dirname */
const fs            = require('fs'),
      path          = require('path'),
      npmPackage    = require(path.resolve(__dirname, './package.json'));

function zeroPad( value ) {
  if (value < 10)
    value = '0' + value;
  return value;
}

function getDateTime() {
  const date  = new Date(),
        year  = date.getFullYear(),
        hour  = zeroPad( date.getHours() ),
        min   = zeroPad( date.getMinutes() ),
        sec   = '00', //zeroPad( date.getSeconds() ),
        month = zeroPad( date.getMonth() + 1 ),
        day   = zeroPad( date.getDate() );

  return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}

function colorConsole(text, color) {
  colorOptions = {
    red:     '\x1b[31m',
    green:   '\x1b[32m',
    yellow:  '\x1b[33m',
    blue:    '\x1b[34m',
    magenta: '\x1b[35m',
    cyan:    '\x1b[36m',
  }
  return colorOptions[color] + text + '\x1b[0m';
}

// Compile the copyright comment with the current app version and timestamp
const licenseHeader = (npmPackage.licenseHeader.replace('{{VERSION}}', npmPackage.version)).replace('{{COMPILE-TIME}}', getDateTime()),
      insertLicense = Buffer.from(`/*! ${licenseHeader} */\n`);

function prepareDist(extension) {
  const outFile = `dist/${npmPackage.name}.min.${extension}`,
        content = fs.readFileSync(outFile),
        outStream = fs.openSync(outFile, 'w+');
  fs.writeSync(outStream, insertLicense);
  fs.writeSync(outStream, content);
  fs.close(outStream, err => { if (err) throw err; else console.info( colorConsole(`+ ${outFile}`, 'cyan') ); });
}

// Write copyright header to CSS file
prepareDist('css');

// Write copyright header to JS file
prepareDist('js');
