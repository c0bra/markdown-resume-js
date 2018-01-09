markdown-resume.js [![Build Status](https://travis-ci.org/c0bra/markdown-resume-js.svg?branch=master)](https://travis-ci.org/c0bra/markdown-resume-js) [![Coverage Status](https://coveralls.io/repos/c0bra/markdown-resume-js/badge.svg?branch=master&service=github)](https://coveralls.io/github/c0bra/markdown-resume-js?branch=master)
==================

Turn a simple markdown document into a resume in HTML and PDF.

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

## Running with docker

    # Build a docker image
    docker build -t md2resume .

    # In the directory where your resume is, run the container
    docker run -v $PWD:/src md2resume resume.md

    # You can also generate the pdf format
    docker run -v $PWD:/src md2resume -pdf resume.md

## Run in Watch Mode w/ Live Reload

    npm install -g light-server
    light-server -s . -w "your_resume.md # md2resume your_resume.md"

  Open http://localhost:4000/your_resume.html in a browser and see changes live.

## Use as a node module

    var md2resume = require('markdown-resume')

    # Generate HTML
    md2resume('my-resume-file.md', 'default')
    .then(html)
        # ... do something with html
    });

## Acknowledgments

As above, this library steals pretty much everything from [markdown-resume](https://github.com/there4/markdown-resume).
