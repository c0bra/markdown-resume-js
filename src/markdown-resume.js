/* eslint arrow-body-style: 0, arrow-parens: 0, no-shadow: 0 */

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */


const { promisify } = require('bluebird');
const CleanCSS = require('clean-css');
const cheerio = require('cheerio');
const Inliner = require('inliner');
const less = require('less');
const marked = promisify(require('marked'));
const { minify } = require('html-minifier');
const mustache = require('mustache');
const path = require('path');
const readFile = promisify(require('fs').readFile);

const installDir = path.join(__dirname, '..');

// Use Github-flavored-markdown (GFM) which uses linebreaks differently
marked.setOptions({ breaks: true });

const isMarkdown = file => ['.md', '.markdown'].indexOf(path.extname(file)) >= 0;
const getCommonStyles = () => readFile(path.join(installDir, 'templates', 'common.css'), 'utf-8');
const getTemplateHtml = template => readFile(path.join(installDir, 'templates', template, 'index.html'), 'utf-8');

function getTemplateStyles(template = 'default') {
  const lessDir = path.join(installDir, 'templates', template, 'assets', 'less');
  const lessOptions = {
    relativeUrls: true,
    paths: [lessDir],
    filename: 'resume.less',
  };
  return readFile(path.join(lessDir, 'resume.less'), 'utf-8')
    .then(lessInput => Promise.all([
      less.render(lessInput, lessOptions),
      getCommonStyles(),
    ]))
    .spread((output, common) => new CleanCSS().minify(common + output.css).styles);
}

module.exports = (fileName, template = 'default') => {
  if (!isMarkdown(fileName)) return Promise.reject(new Error('Only markdown files are supported'));

  return readFile(path.resolve('./', fileName), 'utf-8')
    .then((sourceContents) => {
      if ((sourceContents == null) || (sourceContents.trim() === '')) {
        throw new Error('Source file is empty');
      }

      return Promise.all([
        marked(sourceContents),
        getTemplateStyles(template),
        getTemplateHtml(template),
      ]);
    })
    .then(([resume, css, tmpl]) => {
      const $ = cheerio.load(resume);
      const title = `${$('h1').first().text()} | ${$('h2').first().text()}`;

      return minify(mustache.render(tmpl, {
        title,
        style: css,
        resume,
      }));
    })
    .then((html) => new Promise((resolve, reject) => {
      const i = new Inliner(html, (err, inlined) => { /* eslint no-unused-vars: 0 */
        if (err) return reject(err);

        return resolve(inlined);
      });
    }));
};
