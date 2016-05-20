fs = require "fs"
path = require "path"
{exec} = require "child_process"

task "build:bin", "Build the CLI", ->
  fs.mkdirSync "bin" if !fs.existsSync "bin"

  exec "coffee -p src/md2resume-cli.coffee", (error, stdout) ->
    throw error if error

    fs.writeFileSync "bin/md2resume", "#!/usr/bin/env node\n#{stdout}"
    fs.chmodSync "bin/md2resume", "0755"
