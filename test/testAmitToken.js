const { assert } = require('chai');

const BigNumber = web3.BigNumber;

const AmitToken = artifacts.require('AmitToken');

//const {BN} = require('@openzeppelin/test-helpers');

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('AmitToken', accounts => {
  const _name = 'Amit Token';
  const _symbol = 'Amit';
  const _decimals = 18;
  const _totalSupply = '100000000000000000000000000';

  //we create a new contract instance freshly deployed on the test chain for testing
  beforeEach(async function () {
    this.token = await AmitToken.new(_name, _symbol, _decimals);
  });

  
  describe('token attributes', function() {
    it('has the correct name', async function() {
      const name = await this.token.name();
      //console.log(name);      
      name.should.equal(_name);//assert.equal(name, _name);
    });

    it('has the correct symbol', async function() {
      const symbol = await this.token.symbol();
      symbol.should.equal(_symbol);
    });

    it('has the correct decimals', async function() {
       const decimals = await this.token.decimals();
       assert.equal(decimals.toString(),_decimals.toString());
      //decimals.should.equal();
    });

  it('has the correct token supply', async function() {
      const totalSupply = await this.token.totalSupply();
      assert.equal(totalSupply.toString(),_totalSupply);
       
    });

  });
});
