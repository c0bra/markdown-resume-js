markdown-resume.js [![Build Status](https://travis-ci.org/JaKXz/markdown-resume-js.svg?branch=master)](https://travis-ci.org/JaKXz/markdown-resume-js) [![Coverage Status](https://coveralls.io/repos/JaKXz/markdown-resume-js/badge.svg?branch=master&service=github)](https://coveralls.io/github/JaKXz/markdown-resume-js?branch=master)
==================

Turn a simple markdown document into a resume in HTML and PDF.

The inspiration for this library is this PHP version: [markdown-resume](https://github.com/there4/markdown-resume).

## Features

* PDF generation via wkhtmltopdf
* Responsive design for multiple device viewport sizes
* Simple Markdown formatting

## Quickstart

The generated files will be put in the same directory as your source file.

    # For usage on the command line
    npm install -g markdown-resume

    # Generate HTML file
    md2resume my-resume-file.md

    # Generate PDF file
    md2resume --pdf my-resume-file.md

## Use as a node module

    var md2resume = require('markdown-resume')

    # Generate HTML
    md2resume.generate('my-resume-file.md', function(err, out) {
        # ... do something with 'out'
    });

    # Same as a above
    md2resume.generate('my-resume-file.md', { format: 'html' }, function(err, out) { ... });

    # Generate PDF
    md2resume.generate('my-resume-file.md', { format: 'pdf' }, function(err, pdf) {
        # ... do something with pdf
    });
    
    