const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3")
const {interface, bytecode} = require("./compile")

const provider = new HDWalletProvider('voice floor ladder rapid pause better future foot visa annual pudding fire','https://rinkeby.infura.io/v3/8694738a5f584568bb375a2e44f50073');

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy from account", accounts[0]);

    const result  =  await new web3.eth.Contract(JSON.parse(interface)).deploy({data:bytecode}).send({from: accounts[0], gas:'10000000' , gasPrice: '20000000000'});

    console.log(result.options.address);

}

deploy();