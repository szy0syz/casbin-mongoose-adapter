const fs = require('fs')
const { resolve } = require('path')
const mongoose = require('mongoose')

const schemaDir = resolve(__dirname, './schema')

console.log(schemaDir)

fs
  .readdirSync(schemaDir)
  .filter(file => ~file.search(/\.js$/))
  .forEach(file => require(resolve(schemaDir, file)))