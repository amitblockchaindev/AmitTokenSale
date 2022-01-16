// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Crowdsale.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
 
/**
Create an ICO Smart Contract, with your custom ERC20 Token with the below details: 
Total Supply of Token: 100 Million
Initial Value at $0.01 (Pre-sale Quantity: 30 Million)
2nd Sale Value at $0.02 (Seed Sale Quantity: 50 Million)
Final Sale for Remaining Tokens should be dynamically allocated.
 */
contract AmitTokenCrowdsale is Crowdsale, Ownable {



  bool private preSaleClosed ;//defaults to false
  bool private seedSaleClosed ;//defaults to false
  uint256 private preSaleLimit;
  uint256 private seedSaleLimit;
  uint256 private preSaleRate;  
  uint256 private seedSaleRate;

  constructor(
    uint256 _preSaleRate,
    uint256 _preSaleLimit,
    uint256 _seedSaleRate,
    uint256 _seedSaleLimit,
    address payable  _wallet,
    ERC20 _token
  )
    Crowdsale(_preSaleRate, _wallet, _token)
  
    public
  {
       
    require(_preSaleLimit <= _token.totalSupply(), "PreSaleLimit is more than total supply");
    require(_seedSaleLimit <= _token.totalSupply(), "SeedSaleLimit is more than total supply");
    require(_preSaleLimit+_seedSaleLimit <= _token.totalSupply(), "PreSaleLimit+SeedSaleLimit exceeds total supply");
    preSaleLimit  = _preSaleRate;
    seedSaleLimit = _preSaleLimit;
    preSaleRate   = _seedSaleRate;
    seedSaleRate  = _seedSaleLimit;
  
    //TODO
    //Need to find how to pause the direct token sales..
    // Pause Token
    // token().pause();
 
  }


  /**
  * @dev Extend parent behavior allowing purchase only when seedSaleClosed is false and 
  total supply will not be breached if this weiAmount is accepted. 
  * @param _beneficiary Token purchaser
  * @param _weiAmount Amount of wei contributed
  */
  function _preValidatePurchase(
    address _beneficiary,
    uint256 _weiAmount
  )
    internal view
  {
    super._preValidatePurchase(_beneficiary, _weiAmount);
    require(!seedSaleClosed, "Seed sale is closed now");
    require(weiRaised().add(_weiAmount) <= token().totalSupply(), "Total supply will be exceeded.  Use lesser amount");
  }

    /**
     * @dev Extend parent behavior to check if preSaleLimit and seedSaleLimit
     has been reached and update state variables accordingly.
     * @param _beneficiary Address performing the token purchase
     * @param _weiAmount Value in wei involved in the purchase
     */
    function _updatePurchasingState(address _beneficiary, uint256 _weiAmount) 
    internal  {
        super._updatePurchasingState(_beneficiary, _weiAmount);
        if(weiRaised() >= preSaleLimit)
        {
            setRate(seedSaleRate);
            preSaleClosed = true;
        }
        else
        {
            if(weiRaised() >= seedSaleLimit)
            {               
                finalization();
            }
        }
    }

   
    /**
   * @dev enables to close the seedSale
  */
  function finalization() internal {
       
       seedSaleClosed = true;
       preSaleClosed = true;
       //TODO
      //As we paused the sale of direct tokens, we need to unpause it
      //so that one can directly interact with the Token contract 
      //to transfer tokens.
      //token().unpause();
            
  }

/**
     * @dev this will allow us to close the crowd sale prematurely.
     */
  function finalize() external onlyOwner
  {
      finalization();
  }

      /**
     * @return preSaleClosed
     */
    function isPreSaleClosed() public view returns (bool) {
        return preSaleClosed;
    }

      /**
     * @return seedSaleClosed
     */
    function isSeedSaleClosed() public view returns (bool) {
        return seedSaleClosed;
    }
}