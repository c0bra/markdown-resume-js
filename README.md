markdown-resume.js
==================

Turn a simple markdown document into a resume in HTML and PDF.

This module borrows heavily from the PHP script [markdown-resume](https://github.com/there4/markdown-resume).

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

## Acknowledgments

As above, this library steals pretty much everything from [markdown-resume](https://github.com/there4/markdown-resume).