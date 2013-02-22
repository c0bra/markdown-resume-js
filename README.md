markdown-resume.js
==================

Turn a simple markdown document into a resume in HTML and PDF.

This module borrows heavily from the PHP script [markdown-resume](https://github.com/there4/markdown-resume).

## Features

* PDF generation via wkhtmltopdf
* Responsive design for multiple device viewport sizes
* Simple Markdown formatting

## Quickstart
    
    # For usage on the command line
    npm install -g markdown-resume

    # Generate HTML file
    markdown-resume my-resume-file.md

    # Generate HTML file and a pdf
    markdown-resume --pdf my-resume-file.md

## Use as a node module

    var mdresume = require('markdown-resume')

    # Generate HTML
    var output = mdresume.generate('my-resume-file.md');
    var output = mdresume.generate('my-resume-file.md', { format: 'html' });

    # Generate PDF
    var output = mdresume.generate('my-resume-file.md', { format: 'pdf' });

## Acknowledgments

As above, this library steals pretty much everything from [markdown-resume](https://github.com/there4/markdown-resume).