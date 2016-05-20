md2resume = require "../src/markdown-resume.coffee"
cheerio = require "cheerio"
juice = require "juice"

describe "markdown-resume-js", ->
  context "Reading non-markdown files", ->
    it "should reject the promise when given a non-markdown file", ->
      readNonMarkdownFile = Promise.resolve md2resume "test/fixtures/other.html"
      expect(readNonMarkdownFile)
        .to.be.rejectedWith /Only markdown files are supported/

  context "Reading missing markdown", ->
    it "should reject the promise when the markdown file is missing", ->
      readMissingFilePromise = Promise.resolve md2resume "missing-file.md"
      expect(readMissingFilePromise).to.be.rejectedWith /no such file/

    it "should reject the promise with an error when the file is empty", ->
      readEmptyFilePromise = Promise.resolve md2resume "test/fixtures/empty.md"
      expect(readEmptyFilePromise).to.be.rejectedWith /Source file is empty/

  context "Writing html", ->
    # FIXME - this is a roundabout kind of way to test that the styles are being
    # applied correctly.
    it "should produce valid html with the right styles applied", ->
      contentChecks = (resume) ->
        resumeClassStyles =
          position: "relative"
          padding: "10px 20px"

        $ = cheerio.load juice resume
        expect($(".resume").css()).to.deep.equal resumeClassStyles
        expect($("ol li").get().length).to.equal 9
        expect($("title").text())
          .to.equal "Brian Hann | Senior Web Developer, Data Nerd"

      renderResumePromise = Promise.resolve md2resume "test/fixtures/resume.md"
      expect(renderResumePromise).to.be.fulfilled
        .and.eventually.satisfy contentChecks

  context "Writing pdf", ->
