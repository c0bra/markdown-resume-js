path = require "path"
coffeeCoverage = require "coffee-coverage"
coverageVar = coffeeCoverage.findIstanbulVariable()
writeFile = "#{__dirname}/coverage/coverage-coffee.json"
writeOnExit = if !coverageVar? then writeFile else null

coffeeCoverage.register
  instrumentor: "istanbul"
  basePath: path.resolve __dirname, "src"
  exclude: [
    "md2resume-cli.coffee"
  ]
  coverageVar: coverageVar
  writeOnExit: writeOnExit
  initAll: false
