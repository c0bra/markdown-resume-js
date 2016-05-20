"use strict"

{all, promisify, reject} = require "bluebird"
CleanCSS = require "clean-css"
cheerio = require "cheerio"
less = require "less"
marked = promisify require "marked"
{minify} = require "html-minifier"
mustache = require "mustache"
path = require "path"
readFile = promisify require("fs").readFile

installDir = path.join __dirname, ".."

# Use Github-flavored-markdown (GFM) which uses linebreaks differently
marked.setOptions
  breaks: true

module.exports = (fileName, template = "default") ->
  if !isMarkdown fileName
    return reject new Error("Only markdown files are supported")
  readFile path.resolve("./", fileName), "utf-8"
  .then (sourceContents) ->
    if !sourceContents? or sourceContents.trim() is ""
      throw new Error("Source file is empty")

    all [
      marked sourceContents
      getTemplateStyles template
      getTemplateHtml template
    ]
  .spread (resume, css, template) ->
    $ = cheerio.load resume
    title = "#{$("h1").first().text()} | #{$("h2").first().text()}"

    minify mustache.render template,
      title: title
      style: css
      resume: resume

getTemplateStyles = (template = "default") ->
  lessDir = path.join installDir, "templates", template, "assets", "less"
  lessOptions =
    relativeUrls: true
    paths: [lessDir]
    filename: "resume.less"
  readFile path.join(lessDir, "resume.less"), "utf-8"
  .then (lessInput) -> all [
    less.render lessInput, lessOptions
    getCommonStyles()
  ]
  .spread (output, common) -> new CleanCSS().minify(common + output.css).styles

getTemplateHtml = (template) ->
  readFile path.join(installDir, "templates", template, "index.html"), "utf-8"

getCommonStyles = ->
  readFile path.join(installDir, "templates", "common.css"), "utf-8"

isMarkdown = (file) -> [
  ".md"
  ".markdown"
].indexOf(path.extname(file)) >= 0
