import hre, { ethers } from "hardhat";

import chai, { expect } from 'chai'
import { BigNumber } from "ethers"
import { it } from "mocha";

describe("WheelOfFortune Levels", function () {

    const WheelOfFortune = async () => {
        const [owner, user1, user2, user3] = await ethers.getSigners();
        const fortune = await ethers.getContractFactory("WheelOfFortune");
        const deployedfortune = await fortune.deploy();
     
        const initialBalance: BigNumber = ethers.utils.parseEther("10")

        owner.sendTransaction({
            to: owner.address,
            value: initialBalance
        });

        const balanceDeployed = await ethers.provider.getBalance(deployedfortune.address)


        return{
            owner,
            user1,            
            deployedfortune,
            balanceDeployed
        }
    }



    it('test fallback function', async () => {

        const { owner, deployedfortune, balanceDeployed } = await WheelOfFortune();

        const valueSend: BigNumber = ethers.utils.parseEther("1")

        //console.log("value Send " + valueSend)

        await owner.sendTransaction({
            to: deployedfortune.address,
            value: valueSend
        });

        const valueTotal: BigNumber = valueSend.add(balanceDeployed)        

        expect(valueTotal).to.equal(await ethers.provider.getBalance(deployedfortune.address))
    });


    // se prueba con la funcion tipo public
    it('function setGameStruct', async () =>{
        const { user1, deployedfortune } = await WheelOfFortune()

        const _id : Number = await deployedfortune.games.length

        // crear un numero random entre 0 y 1000
        const _bet : Number = Math.floor(Math.random() * (1000 - 0)) + 0       

        const _blockNumber : Number = await ethers.provider.getBlockNumber()
        
        await deployedfortune.setGameStruct(_id, user1.address, _bet, _blockNumber)
        
        let myGame = await deployedfortune.myGame()

        expect(_id).to.equal(myGame.id)
        expect(_bet).to.equal(myGame.bet)
        expect(user1.address).to.equal(myGame.player)
        expect(_blockNumber).to.equal(myGame.blockNumber)       
    })

    // se prueba con la funcion tipo public
    it('funtion addGames', async () =>{
        const { user1, deployedfortune } = await WheelOfFortune()
        const _id : Number = await deployedfortune.games.length

        // crear un numero random entre 0 y 1000
        const _bet : Number = Math.floor(Math.random() * (1000 - 0)) + 0       

        const _blockNumber : Number = await ethers.provider.getBlockNumber()        
        await deployedfortune.setGameStruct(_id, user1.address, _bet, _blockNumber)        
        let myGame = await deployedfortune.myGame()
     
        await deployedfortune.addGames(myGame)

        let array : any[] =  await deployedfortune.games(0)

        //no se que pasa con el length no esta funcionando
        
        expect(array[0]).to.equal(_id)
        expect(array[1]).to.equal(user1.address)
        expect(array[2]).to.equal(_bet)
        expect(array[3]).to.equal(_blockNumber)
    })



    
});