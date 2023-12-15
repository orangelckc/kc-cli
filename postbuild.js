// postbuild.js
import fs from 'node:fs'

const regex = /^(#!.*\n)?/
const file = 'output/cli.js'
const replacement = '$&import { createRequire as createImportMetaRequire } from \'module\'; import.meta.require ||= (id) => { return createImportMetaRequire(import.meta.url)(id); };'

fs.readFile(file, 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  const result = data.replace(regex, `${replacement}\n`)

  fs.writeFile(file, result, 'utf8', (err) => {
    if (err)
      console.error(err)
  })
})
