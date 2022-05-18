const path = require('path')
const fs = require('fs')
const solc = require('solc')

const myLotteryPath = path.resolve(__dirname, 'contracts','Lottery.sol')
const source = fs.readFileSync(myLotteryPath, 'utf8')

const compiledData = solc.compile(source, 1)

module.exports = compiledData.contracts[':Lottery']