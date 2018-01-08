/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const md2resume = require('../src/markdown-resume');
const cheerio = require('cheerio');
const juice = require('juice');

describe('markdown-resume-js', () => {
  context('Reading non-markdown files', () => {
    it('should reject the promise when given a non-markdown file', () => {
      const readNonMarkdownFile = Promise.resolve(md2resume('test/fixtures/other.html'));
      return expect(readNonMarkdownFile)
        .to.be.rejectedWith(/Only markdown files are supported/);
    });
  });

  context('Reading missing markdown', () => {
    it('should reject the promise when the markdown file is missing', () => {
      const readMissingFilePromise = Promise.resolve(md2resume('missing-file.md'));
      return expect(readMissingFilePromise).to.be.rejectedWith(/no such file/);
    });

    return it('should reject the promise with an error when the file is empty', () => {
      const readEmptyFilePromise = Promise.resolve(md2resume('test/fixtures/empty.md'));
      return expect(readEmptyFilePromise).to.be.rejectedWith(/Source file is empty/);
    });
  });

  context('Writing html', () => {
    // FIXME - this is a roundabout kind of way to test that the styles are being
    // applied correctly.
    it('should produce valid html with the right styles applied', () => {
      const contentChecks = (resume) => {
        const resumeClassStyles = {
          position: 'relative',
          padding: '10px 20px',
        };

        const $ = cheerio.load(juice(resume));
        expect($('.resume').css()).to.deep.equal(resumeClassStyles);
        expect($('ol li').get().length).to.equal(9);
        return expect($('title').text())
          .to.equal('Brian Hann | Senior Web Developer, Data Nerd');
      };

      const renderResumePromise = Promise.resolve(md2resume('test/fixtures/resume.md'));
      return expect(renderResumePromise).to.be.fulfilled
        .and.eventually.satisfy(contentChecks);
    });
  });

  return context('Writing pdf', () => {});
});
