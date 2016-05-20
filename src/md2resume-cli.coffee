"use strict"

fs = require "fs"
path = require "path"
pdf = require "html-pdf"
program = require "commander"

installDir = path.join __dirname, ".."
md2resume = require path.join installDir, "lib", "markdown-resume"
{description, version} = require path.join installDir, "package.json"

# Executable options
program
  .version version
  .description """
  #{description}
    NOTE: generated files still in #{process.cwd()}/ will be overridden.
  """
  .usage "[options] [source markdown file]"
  .option "--pdf", "output as PDF as well as HTML"
  .option "-t, --template <template>", "Specify the template", "default"
  .parse process.argv

sourceFile = program.args[0]
if !sourceFile?
  console.warn "Error: No source file specified."
  console.log program.help()
  process.exit()

md2resume sourceFile, program.template
.then (htmlContents) ->
  sourceFileBasename = path.basename sourceFile, path.extname sourceFile

  if program.pdf
    pdfOutputFileName = "#{sourceFileBasename}.pdf"
    pdf.create(htmlContents).toFile pdfOutputFileName, (error, res) ->
      throw error if error
      console.log "Successfully wrote pdf file: #{res.filename}"

  outputFileName = "#{sourceFileBasename}.html"
  fs.writeFile outputFileName, htmlContents, (error) ->
    throw error if error
    console.log "Successfully wrote html: #{process.cwd()}/#{outputFileName}"
.catch (error) ->
  console.error error
  process.exit 1
