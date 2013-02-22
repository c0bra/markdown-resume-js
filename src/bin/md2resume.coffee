#!/usr/bin/env node

commander = require('commander')
mdresume = require('markdown-resume')

# Executable options
program
  .usage('[options] [source markdown file]')
  .option('--pdf', 'Include PDF output')
  .option('-t, --template <template>', 'Specify the template html file', './assets/templates/default.html')
  .parse(process.argv)

  # Filename
  sourceFile = program.args[0]

  if !sourceFile?
    throw "No source file specified"

  # Get the basename of the source file
  sourceFileBasename = path.basename sourceFile, path.extname(sourceFile)

  # Make the output filename
  outputFileName = path.join('output', sourceFileBasename + '.html')

  # Write the file contents
  fs.writeFileSync outputFileName, rendered

  console.log "Wrote html to: #{outputFileName}"

  output = mdresume.generate()