VERSION = '0.0.0'

fs = require('fs')
path = require('path')
program = require('commander')
markdown = require( "markdown" ).markdown
cheerio = require("cheerio")
mustache = require('mustache')
sqwish = require('sqwish')

concatCss = (files) ->
  ret = ""

  for file in files
    contents = fs.readFileSync path.join('assets', 'css', file), 'utf8'
    ret += contents

  return ret

# Executable options
program
  .version(VERSION)
  .usage('[options] [source markdown file]')
  .option('-f, --format <fmt>', 'Specify the output format: html or pdf [html]')
  .option('-t, --template <template>', 'Specify the template html file', )
  .parse(process.argv);

# Filename
sourceFile = program.args[0]

# Make sure the source file exists
if !sourceFile?
  console.log "No source file specified"
  process.exit()

# Load the template file
template = fs.readFileSync path.join('assets', 'templates', 'default.html'), 'utf8'

# Get the list of css asset files
cssFiles = fs.readdirSync path.join('assets', 'css')

# Load in all the stylesheets
rawstyle = concatCss(cssFiles)

# Minify the css
style = sqwish.minify(rawstyle)

# Read the file contents in 
input = fs.readFileSync sourceFile, 'utf8'

# Convert the file to HTML
resume = markdown.toHTML(input)
#console.log resume
#process.exit()

# Get the title of the document
$ = cheerio.load(resume)
title = $('h1').first().text() + ' | ' + $('h2').first().text()

# Use mustache to turn the generated html into a pretty document with Mustache
rendered = mustache.render template,
  title  : title
  style  : style
  resume : resume

#console.log rendered
#process.exit()

# Get the basename of the source file
sourceFileBasename = path.basename sourceFile, path.extname(sourceFile)

# Make the output filename
outputFileName = path.join('output', sourceFileBasename + '.html')

# Write the file contents
fs.writeFileSync outputFileName, rendered

console.log "Wrote html to: #{outputFileName}"

# console.log output

# ***TODO: How do we make a command-line script that's available in the $PATH?
