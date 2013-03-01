
fs = require('fs')
path = require('path')
exec = require('child_process').exec
program = require('commander')
marked = require('marked')
cheerio = require("cheerio")
mustache = require('mustache')
stylus = require('stylus')
sqwish = require('sqwish')
temp = require('temp')

# Set the Markdown processor options
marked.setOptions
  breaks: true # Use Github-flavored-markdown (GFM) which uses linebreaks differently

installDir = path.join(__dirname, '..');

Object.defineProperty Object::, "extend",
  enumerable: false
  value: (from) ->
    props = Object.getOwnPropertyNames(from)
    dest = this
    props.forEach (name) ->
      if name of dest
        destination = Object.getOwnPropertyDescriptor(from, name)
        Object.defineProperty dest, name, destination

    return this


# Method to concatenate a bunch of CSS files
concatCss = (files) ->
  ret = ""

  for file in files
    contents = fs.readFileSync path.join(installDir, 'assets', 'css', file), 'utf8'
    ret += "\n" +contents

  return ret

generate = (sourceFile, userOpts, callback) ->
  opts =
    format: 'html'
    template: path.join(installDir, 'assets', 'templates', 'default.html')

  # No third argument, callback must be in the second position
  if !callback?
    callback = userOpts

  opts.extend userOpts

  if !sourceFile?
     return callback "Source not specified"

  # Default to treating the sourceFile argument as the contents of the file
  sourceContents = sourceFile

  # If the sourceFile argument IS an actual file, read it in
  if fs.existsSync(sourceFile)
    sourceContents = fs.readFileSync sourceFile, 'utf8'

  if !sourceContents? || sourceContents == ""
    return callback "Source is empty"

  # Load the template file
  template = fs.readFileSync opts.template, 'utf8'

  # Get the list of css asset files
  cssFiles = fs.readdirSync path.join(installDir, 'assets', 'css')

  # Load in all the stylesheets
  rawstyle = concatCss cssFiles

  # Process the sass
  stylus.render rawstyle, (err, css) ->
    if err?
      return callback "Error processing the SASS: #{err}"

    # Minify the css
    css = sqwish.minify css

    # Convert the file to HTML
    resume = marked sourceContents

    # Get the title of the document
    $ = cheerio.load(resume)
    title = $('h1').first().text() + ' | ' + $('h2').first().text()

    # Use mustache to turn the generated html into a pretty document with Mustache
    rendered = mustache.render template,
      title  : title
      style  : css
      resume : resume
      nopdf  : opts.format != 'pdf'

    # Write the PDF if we're told to
    if opts.format == 'html'
      return callback undefined, rendered
    else if opts.format == 'pdf'
      # Alter the body class in the resume document in order to make it render right in PDF format
      pdfRendered = rendered.replace('body class=""', 'body class="pdf"')

      # Create temporary file to HTML source to
      pdfSourceFilename = temp.path({suffix: '.html'})

      # Create temporary file to write the PDF to
      pdfOutputFilename = temp.path({suffix: '.pdf'})

      fs.writeFileSync pdfSourceFilename, pdfRendered
      
      exec 'wkhtmltopdf ' + pdfSourceFilename + ' ' + pdfOutputFilename, (err, stdout, stderr) ->
        if err?
          return callback "Error writing pdf: #{err}"

        pdfContents = fs.readFileSync pdfOutputFilename, 'binary'

        return callback undefined, pdfContents

# Export module
module.exports =
  generate: generate
