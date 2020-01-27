const { readFileSync, accessSync, constants } = require('fs')
const { join } = require('path')
const { parse } = require('dotenv')

module.exports = function(moduleOptions) {
  const options = {
    path: './',
    filename: 'secrets',
    ...moduleOptions
  }

  const envFilePath = join(options.path, options.filename)

  try {
    accessSync(envFilePath, constants.R_OK)
  } catch (err) {
    return
  }

  return parse(readFileSync(envFilePath))
}
