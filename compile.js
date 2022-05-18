const path = require('path')
const fs = require('fs')
const solc = require('solc')

const inboxPath = path.resolve(__dirname, 'contracts','sample.sol')
const source = fs.readFileSync(inboxPath, 'utf8')

const compiledData = solc.compile(source, 1)

module.exports = compiledData.contracts[':Sample']