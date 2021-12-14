// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WheelOfFortune {
    Game[] public games;
    Game public myGame;

    struct Game {
        uint256 id;
        address player;
        uint256 bet;
        uint256 blockNumber;
    }

    function setGameStruct(
        uint256 _id,
        address _player,
        uint256 _bet,
        uint256 _blockNumber
    ) public {
        myGame = Game(_id, _player, _bet, _blockNumber);        
    }

    function addGames(Game memory _game) public {
        games.push(_game);
    }

    function rand(bytes32 hash, uint256 max)
        private
        pure
        returns (uint256 result)
    {
        return uint256(keccak256(abi.encodePacked(hash))) % max;
    }

    function spin(uint256 _bet) public payable {
        require(msg.value >= 0.01 ether);
        uint256 gameId = games.length;
        //games.length++;

        setGameStruct(gameId, msg.sender, _bet, block.number);
        addGames(games[gameId]);

        if (gameId > 0) {
            uint256 lastGameId = gameId - 1;
            uint256 num = rand(blockhash(games[lastGameId].blockNumber), 100);
            if (num == games[lastGameId].bet) {
                (bool succes, ) = payable(games[lastGameId].player).call{
                    value: msg.value
                }("");
                require(succes);
            }
        }
    }

    receive() external payable {}
}
