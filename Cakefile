fs = require 'fs'
path = require 'path'
{exec} = require 'child_process'

task 'build', 'Build this module', ->
  # Compile the library
  exec 'coffee -o lib src/lib/markdown-resume.coffee', (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr

  for binfile in fs.readdirSync 'src/bin'
    basename = path.basename binfile, '.coffee'

    cmd = "coffee -p bin src/bin/#{binfile}"
    # console.log "Running command: " + cmd
    exec cmd, (err, stdout, stderr) ->
      throw err if err

      stdout = "#!/usr/bin/env node\n" + stdout
      fs.writeFileSync "bin/#{basename}", stdout

      # cmd = "mv bin/#{basename}.js bin/#{basename}"
      # console.log "Running command: " + cmd
      # exec cmd