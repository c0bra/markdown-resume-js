  /*eslint no-console: "off"*/

'use strict';

const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');
const program = require('commander');

const installDir = path.join(__dirname, '..');
const md2resume = require(path.join(installDir, 'src'));

// Get the description and version from package.json
const {description, version} = require(path.join(installDir, 'package.json'));

// Process command line args
program
  .version(version)
  .description(`${description}
    NOTE: generated files still in ${process.cwd()}/ will be overridden.`)
  .usage('[options] [source markdown files]')
  .option('--pdf', 'output as PDF as well as HTML')
  .option('-t, --template <template>', 'Specify the template', 'default')
  .parse(process.argv);

// Source file is the first argument
let sourceFile = program.args[0];

// Make sure we have a source file
if (!sourceFile) {
  console.warn('Error: no source file specified');
  console.log(program.help());
  process.exit();
}

md2resume(sourceFile, program.template)
.then((html) => {
  let sourceFileBasename = path.basename(sourceFile, path.extname(sourceFile));

  // Create pdf if option is set
  if (program.pdf) {
    let pdfOutputFilename = `${sourceFileBasename}.pdf`;
    pdf.create(html).toFile(pdfOutputFilename, (err, res) => {
      if (err) throw err;
      console.log(`Successfully wrote pdf file: ${res.filename}`);
    });
  }

  let outputFilename = `${sourceFileBasename}.html`;
  fs.writeFile(outputFilename, html, (err) => {
    if (err) throw err;
    console.log(`Successfully wrote html: ${process.cwd()}/${outputFilename}`);
  });
})
.catch((err) => {
  console.error(err);
  process.exit(1);
});
