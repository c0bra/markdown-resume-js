'use strict';

const CleanCSS = require('clean-css');
const Promise = require('bluebird');
const less = require('less');
const marked = Promise.promisify(require('marked'));
const mustache = require('mustache');
const cheerio = require('cheerio');
const path = require('path');
const existsSync = require('fs').existsSync;
const readFile = Promise.promisify(require('fs').readFile);
const minify = require('html-minifier').minify;

////////////

// Setup
//   Use Github-flavored-markdown (GFM) which uses linebreaks differently
marked.setOptions({ breaks: true });

let installDir = path.join(__dirname, '..');

////////////

function generate(filename, template = 'default') {
  // Make sure file ends with
  if (!isMarkdown(filename)) {
    return Promise.reject(new Error('Only markdown files are supported'));
  }

  if (!existsSync(filename)) {
    return Promise.reject(new Error(`File ${filename} does not exist`));
  }

  return readFile(path.resolve('./', filename), 'utf-8')
  .then(contents => {
    // Make sure file is empty
    if (!contents || contents.trim() === '') {
      return Promise.reject(new Error('Source file is empty'));
    }

    return Promise.all([
      marked(contents),
      getTemplateStyles(template),
      getTemplateHtml(template)
    ]);
  })
  .spread((resume, css, template) => {
    let $ = cheerio.load(resume);
    let title = `${$('h1').first().text()} | ${$('h2').first().text()}`;

    return minify(mustache.render(template, {
      title: title,
      style: css,
      resume: resume
    }));
  });
}

// Utils

function getTemplateStyles (template = 'default') {
  let lessDir = path.join(installDir, 'templates', template, 'assets', 'less');
  let lessOptions = {
    relativeUrls: true,
    paths: [lessDir],
    filename: 'resume.less'
  };

  return readFile(path.join(lessDir, 'resume.less'), 'utf-8')
  .then((lessInput) => {
    return Promise.all([
      less.render(lessInput, lessOptions),
      getCommonStyles()
    ])
    .spread((output, common) => {
      return (new CleanCSS()).minify(common + output.css).styles;
    });
  });
}

function getTemplateHtml(template) {
  return readFile(path.join(installDir, 'templates', template, 'index.html'), 'utf-8');
}

function getCommonStyles() {
  return readFile(path.join(installDir, 'templates', 'common.css'), 'utf-8');
}

function isMarkdown(file) {
  return [
    '.md',
    '.markdow'
  ].indexOf(path.extname(file)) >= 0;
}

module.exports = generate;
