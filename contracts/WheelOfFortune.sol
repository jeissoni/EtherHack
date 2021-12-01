
// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract WheelOfFortune {
  Game[] public games;

  struct Game {
      address player;
      uint id;
      uint bet;
      uint blockNumber;
  }

  function spin(uint256 _bet) public payable {
    require(msg.value >= 0.01 ether);
    uint gameId = games.length;
    //games.length++;
    games[gameId].id = gameId;
    games[gameId].player = msg.sender;
    games[gameId].bet = _bet;
    games[gameId].blockNumber = block.number;
    if (gameId > 0) {
      uint lastGameId = gameId - 1;
      uint num = rand(blockhash(games[lastGameId].blockNumber), 100);
      if(num == games[lastGameId].bet) {
        (bool succes, ) = payable(games[lastGameId].player).call{value: msg.value}("");
        require(succes);
      }
    }
  }

  function rand(bytes32 hash, uint max) pure private returns (uint256 result){
    return uint256(keccak256(abi.encodePacked(hash))) % max;
  }

//   function() public payable {}
    receive() external payable {}

}
