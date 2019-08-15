const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider('sibling unknown abuse section goose credit clutch arrive talent cotton artist manage','https://ropsten.infura.io/v3/91f84cfa46204952b3494e93e583e505', 0, 10);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[3]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
     .deploy({data: '0x' + bytecode, arguments: [accounts[0]]})
     .send({from: accounts[3]});
    
     console.log(interface);

    console.log('Contract deployed to', result.options.address);
};

deploy();