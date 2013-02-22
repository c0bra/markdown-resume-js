#!/usr/bin/env node

commander = require('commander')
markdown-resume = require('markdown-resume')

# Executable options
program
  .usage('[options] [source markdown file]')
  .option('--pdf', 'Include PDF output')
  .option('-t, --template <template>', 'Specify the template html file', )
  .parse(process.argv)

  # Filename
  sourceFile = program.args[0]

  if !sourceFile?
    console.log "No source file specified"
    process.exit()