const path = require('path');
const fs = require('fs');
const solc = require('solc');

const paymentPath = path.resolve(__dirname, 'contracts', 'payment.sol');
const source = fs.readFileSync(paymentPath, 'utf8');

module.exports = solc.compile(source, 1).contracts[':Payment'];