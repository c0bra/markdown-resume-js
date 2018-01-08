#!/usr/bin/env node

/* eslint no-console: 0 */

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */


const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');
const program = require('commander');
const readPkg = require('read-pkg');

const md2resume = require('./markdown-resume');

const { description, version } = readPkg.sync(__dirname);

// Executable options
program
  .version(version)
  .description(`\
${description}
  NOTE: generated files still in ${process.cwd()}/ will be overridden.\
`).usage('[options] [source markdown file]')
  .option('--pdf', 'output as PDF as well as HTML')
  .option('-t, --template <template>', 'Specify the template', 'default')
  .parse(process.argv);

const sourceFile = program.args[0];
if ((sourceFile == null)) {
  console.warn('Error: No source file specified.');
  console.log(program.help());
  process.exit();
}

md2resume(sourceFile, program.template)
  .then((htmlContents) => {
    const sourceFileBasename = path.basename(sourceFile, path.extname(sourceFile));

    if (program.pdf) {
      const pdfOutputFileName = `${sourceFileBasename}.pdf`;
      pdf.create(htmlContents).toFile(pdfOutputFileName, (error, res) => {
        if (error) { throw error; }
        return console.log(`Successfully wrote pdf file: ${res.filename}`);
      });
    }

    const outputFileName = `${sourceFileBasename}.html`;
    return fs.writeFile(outputFileName, htmlContents, (error) => {
      if (error) { throw error; }
      return console.log(`Successfully wrote html: ${process.cwd()}/${outputFileName}`);
    });
  }).catch((error) => {
    console.error(error);
    return process.exit(1);
  });
