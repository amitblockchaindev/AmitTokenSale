
const BigNumber = web3.BigNumber;
const {BN} = require("@openzeppelin/test-helpers");
const { assert } = require("chai");

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const AmitToken = artifacts.require('AmitToken');
const AmitTokenCrowdsale = artifacts.require('AmitTokenCrowdsale');

contract('AmitTokenCrowdsale', function([_, wallet, investor1, investor2]) {
  
//   before(async function() {
//     // Transfer extra ether to investor1's account for testing
//     await web3.eth.sendTransaction({ from: _, to: investor1, value: ether(25) })
//   });

  beforeEach(async function () {
    // Token config
    _name = "AmitToken";
    _symbol = "Amit";
    _decimals = 18;

    // Deploy Token
    _token = await AmitToken.new(
      _name,
      _symbol,
      _decimals
    );
    
    // Crowdsale config
    _currentETHUSD = 4500;
    _preSaleRate = new BN(((10**_decimals)/_currentETHUSD)*(0.1)); //$0.1 equivalent wei

    _preSaleLimit = new BN(30*10**6*10**_decimals);//30million
    _seedSaleRate = new BN(((10**_decimals)/_currentETHUSD)*(0.2));//$0.2 equivalent wei
    _seedSaleLimit = new BN(50*10**6*10**_decimals);//50million
    _wallet = wallet;

    // Deploy AmitTokenCrowdsale
    
    crowdsale = await AmitTokenCrowdsale.new(
      _preSaleRate,
      _preSaleLimit,
      _seedSaleRate,
      _seedSaleLimit,
      _wallet,
      _token.address
    );

  });

   describe('crowdsale', function() {
    it('tracks the presale rate', async function() {
      const rate = await crowdsale.rate();
      assert.equal(rate.toString(), _preSaleRate.toString());
      //rate.should.be.bignumber.equal(preSaleRate);
    });

    it('tracks the wallet', async function() {
      const wallet = await crowdsale.wallet();
      assert.equal(wallet.toString(), _wallet.toString());
       
    });

    it('tracks the token', async function() {
      const token = await crowdsale.token();
      token.should.equal(_token.address);
    });
   });

  describe('accepting payments', function() {
    it('should accept payments', async function() {
      const value = new BN(10**_decimals);
      const purchaser = investor2;
      await crowdsale.sendTransaction({ value: value, from: investor1 }).should.be.fulfilled;
      await crowdsale.buyTokens(investor1, { value: value, from: purchaser }).should.be.fulfilled;
    });
  });

  
//Template for tests

   describe('Test Suite Name', function () {
     it('test name', async function () {
      });
   });




  
});
