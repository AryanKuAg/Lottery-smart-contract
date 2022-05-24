const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

const {interface, bytecode} = require('../compile')

let lottery;
let accounts;

beforeEach( async () => {
    accounts = await new web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface)).deploy({data: bytecode}).send({from: accounts[0], gas: '1000000',gasPrice:'20000000000'})
})

describe('describe test', () => {
    it('simple unit it test', () => {
        assert.ok(lottery.options.address);
    })

    it('allows one account to enter', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        })

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })

        assert.equal(accounts[0], players[0])
        assert.equal(1, players.length)
    } )

    it('requires a minimum amount of ether to enter', async() => {
        try{
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0  // in wei
            })

            assert(false);
        }catch(e){
            assert(e);
        }
    })

    it('yeah only me or manager can call this' , async () => {
        try{
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            })
            assert(false);
        }catch(errrr){
            assert(errrr);
        }
    })

    it('sends money to the winner and resets the players array', async () => {

        await lottery.methods.enter().send({
            from:accounts[0],
            value: web3.utils.toWei('2', 'ether')
        })

        const initialBalance=  await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({
            from: accounts[0]});

        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const difference = finalBalance - initialBalance;

        assert(difference > web3.utils.toWei('1.8', 'ether'));
    })

    it('checking empty array after the end of the lottery', async () => {

        await lottery.methods.enter().send({
            from:accounts[0],
            value: web3.utils.toWei('2', 'ether')
        })

        await lottery.methods.enter().send({
            from:accounts[1],
            value: web3.utils.toWei('2', 'ether')
        })

        await lottery.methods.enter().send({
            from:accounts[2],
            value: web3.utils.toWei('2', 'ether')
        })

        let playersLength  = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        if(playersLength.length == 0){
            assert(false);
        }

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        })

        playersLength  = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        if(playersLength.length != 0){
            assert(false);
        }else{
            assert(true);
        }
    })
})