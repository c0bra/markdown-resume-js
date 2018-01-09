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
const chalk = require('chalk');
const meow = require('meow');
const pdf = require('html-pdf');
const md2resume = require('./markdown-resume');

const cli = meow(`
Usage
  $ md2resume resume.md

Options
  --template, -t  Template to use
  --list, -l      List available templates
  --pdf, -p           Generate PDF resume

Examples
  $ md2resume resume.md
  $ md2resume path/to/your_resume.md
  $ md2resume -t blocks resume.md
  $ md2resume --pdf resume.md
`, {
    flags: {
      template: {
        default: 'default',
        alias: 't',
      },
      pdf: { type: 'boolean', alias: 'p' },
      list: { type: 'boolean', alias: 'l' },
    },
  });

if (cli.flags.list) {
  console.log('Available templates:');
  const templateDir = path.join(__dirname, '..', 'templates');
  const templates = fs.readdirSync(templateDir)
    .filter(p => fs.lstatSync(path.join(templateDir, p)).isDirectory())
    .join('\n  ');
  console.log(`  ${templates}`);
  process.exit(0);
}

const sourceFile = cli.input[0];
if ((sourceFile == null)) {
  console.warn('Error: No source file specified.');
  console.log(cli.help);
  process.exit();
}

md2resume(sourceFile, cli.flags.template)
  .then((htmlContents) => {
    const sourceFileBasename = path.basename(sourceFile, path.extname(sourceFile));

    if (cli.flags.pdf) {
      const pdfOutputFileName = `${sourceFileBasename}.pdf`;
      return pdf.create(htmlContents).toFile(pdfOutputFileName, (error, res) => {
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
    console.log(chalk.red(error.message));
    return process.exit(1);
  });
