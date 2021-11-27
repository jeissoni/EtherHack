import { ethers } from "hardhat";
import chai, { expect } from 'chai'
import {BigNumber} from "ethers"



describe("Token", function () {

    const setupAzio777 = async() => {
        const [owner, user1] = await ethers.getSigners();
        const azino777 = await ethers.getContractFactory("Azino777");
        const deployed = await azino777.deploy();

        const AtackAzino777 = await ethers.getContractFactory("AtackAzino777");

        //enviar address contrato a atacar
        const deployedAtack = await AtackAzino777.connect(user1).deploy(deployed.address);

        const initialBalance : BigNumber = ethers.utils.parseEther("10")

        const tx = await owner.sendTransaction({
            to: deployed.address,
            value: initialBalance
        });          

        return{
            owner,
            user1,
            deployed,
            deployedAtack, 
            initialBalance
        }
    }


 


    it ('test fallback function', async() =>{
        const {deployed, owner, initialBalance} = await setupAzio777();

        let balanceDeployed

        const valueSend : BigNumber = ethers.utils.parseEther("10")
        
        //await ethers.provider.getBalance(owner.address)        

        //balanceDeployed = await ethers.provider.getBalance(deployed.address)
        //balanceOwner = await ethers.provider.getBalance(owner.address)      

        const tx = await owner.sendTransaction({
            to: deployed.address,
            value: valueSend
        });        
               
        const valueTotal : BigNumber = valueSend.add(initialBalance)

        //console.log(tx)
        balanceDeployed = await ethers.provider.getBalance(deployed.address)


        expect(valueTotal).to.equal(balanceDeployed)       
    });   


    it('test actak smartContract', async() => {
        //1. enviar eth
        //2. calcular numero ramdom 
        //3. ejecutar contrato 
        //4. ganar 
       
        const {owner, user1, initialBalance, deployedAtack, deployed} = await setupAzio777(); 
        
        
       


        
        //onst currentBlocknNumber = await ethers.provider.getBlockNumber();     

        // console.log("balance inicial:" + ethers.utils.formatEther(initialBalance))

        // //10000
        // console.log("user1 :" + ethers.utils.formatEther(
        //     await ethers.provider.getBalance(user1.address)
        // ))


        // //10
        // console.log("balance Contract :" + ethers.utils.formatEther(
        //     await ethers.provider.getBalance(deployed.address)
        // ))

        let valueSend : BigNumber = ethers.utils.parseEther("1")

        let balanceAntes = await ethers.provider.getBalance(user1.address)

        const valorEsperado : BigNumber = balanceAntes.add(initialBalance)      

        //3.
        //You cannot change the from for a transaction. You will need to reconnect the contract to that signer:
        //https://github.com/ethers-io/ethers.js/issues/1449
        let tx = await deployedAtack.connect(user1).rand({value: valueSend})   
        
        //balancesetupAzio777 = await ethers.provider.getBalance(user1.address)


        // console.log("user1 - segunda vez :" + ethers.utils.formatEther(
        //     await ethers.provider.getBalance(user1.address)
        // ))

        // console.log("balance Contract - segunda vez:" + ethers.utils.formatEther(
        //     await ethers.provider.getBalance(deployed.address)
        // ))

        
        

        // console.log("valor esperado en eht: " + ethers.utils.formatEther(valorEsperado))

        console.log("balance user1: " +  ethers.utils.formatEther(await ethers.provider.getBalance(user1.address)))
        console.log("balance user1 + ganancia: " + ethers.utils.formatEther(valorEsperado) )

        expect(valorEsperado).to.equal(await ethers.provider.getBalance(user1.address))         

        // console.log("owner: "+ ownerAtack.address)
        // console.log("owner: "+ ownerAtack2.address)
        // console.log("deploy: " +deployedAtack.address)

    })
});