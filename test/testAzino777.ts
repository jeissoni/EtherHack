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
        
       
        const {user1, initialBalance, deployedAtack} = await setupAzio777();         

        let valueSend : BigNumber = ethers.utils.parseEther("1")

        let balanceAntes = await ethers.provider.getBalance(user1.address)

        const valorEsperado : BigNumber = balanceAntes.add(initialBalance)      

        //3.
        //You cannot change the from for a transaction. You will need to reconnect the contract to that signer:
        //https://github.com/ethers-io/ethers.js/issues/1449
        let tx = await deployedAtack.connect(user1).rand({value: valueSend})   
        
        const gasUsed :BigNumber = (await tx.wait()).gasUsed
        const gasPrice : BigNumber = tx.gasPrice
        const gasCost : BigNumber = gasUsed.mul(gasPrice)

        expect(valorEsperado.sub(gasCost)).to.equal(await ethers.provider.getBalance(user1.address))         

    })
});