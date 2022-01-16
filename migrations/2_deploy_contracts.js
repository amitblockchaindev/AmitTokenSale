const BigNumber = web3.BigNumber;
const {BN} = require("@openzeppelin/test-helpers");


const AmitTokenContract = artifacts.require("./AmitToken.sol");
const AmitTokenCrowdsaleContract = artifacts.require("./AmitTokenCrowdsale.sol");

module.exports = async function (deployer, network, accounts) {
  const _name = 'Amit Token';
  const _symbol = 'Amit';
  const _decimals = 18;
  const _totalSupply = '100000000000000000000000000';
  await deployer.deploy(AmitTokenContract, _name, _symbol, _decimals);

  const deployedToken = await AmitTokenContract.deployed();

      // Crowdsale config
      _currentETHUSD = 4500;
      _preSaleRate = new BN(((10**_decimals)/_currentETHUSD)*(0.1)); //$0.1 equivalent wei
  
      _preSaleLimit = new BN(30*10**6*10**_decimals);//30million
      _seedSaleRate = new BN(((10**_decimals)/_currentETHUSD)*(0.2));//$0.2 equivalent wei
      _seedSaleLimit = new BN(50*10**6*10**_decimals);//50million
      _wallet = accounts[0];
 
 // Deploy AmitTokenCrowdsale
    
 await deployer.deploy(AmitTokenCrowdsale,
  _preSaleRate,
  _preSaleLimit,
  _seedSaleRate,
  _seedSaleLimit,
  _wallet,
  _token.address
);

};

 
  