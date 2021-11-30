import { ethers } from "hardhat";
import chai, { expect } from 'chai'
import {BigNumber} from "ethers"



describe("PrivateRyan", function () {

    const privateRyan = async() => {
        const [owner, user1] = await ethers.getSigners();
        const PrivateRyan = await ethers.getContractFactory("PrivateRyan");
        const deployedPrivateRyan = await PrivateRyan.deploy();

        const atackPrivateRyan = await ethers.getContractFactory("atackPrivateRyan");

        //enviar address contrato a atacar
        const deployedAtack = await atackPrivateRyan.connect(user1).deploy(deployedPrivateRyan.address, 256);

        const initialBalance : BigNumber = ethers.utils.parseEther("10")

        const tx = await owner.sendTransaction({
            to: deployedPrivateRyan.address,
            value: initialBalance
        });          

        return{
            owner,
            user1,
            deployedPrivateRyan,
            deployedAtack, 
            initialBalance
        }
    }

    it ('test fallback function', async() =>{
        const {deployedPrivateRyan, owner, initialBalance} = await privateRyan();

        let balanceDeployed

        const valueSend : BigNumber = ethers.utils.parseEther("10")       

        const tx = await owner.sendTransaction({
            to: deployedPrivateRyan.address,
            value: valueSend
        });        
               
        const valueTotal : BigNumber = valueSend.add(initialBalance)

        //console.log(tx)
        balanceDeployed = await ethers.provider.getBalance(deployedPrivateRyan.address)


        expect(valueTotal).to.equal(balanceDeployed)       
    }); 


    it('test actak smartContract', async() => {
        
       

        const {user1, initialBalance, deployedPrivateRyan, deployedAtack} = await privateRyan();         
        const max : number = 100;


        let valueSend : BigNumber = ethers.utils.parseEther("1")

        let balanceAntes = await ethers.provider.getBalance(user1.address)

        const valorEsperado : BigNumber = balanceAntes.add(initialBalance)      

        //3.
        //You cannot change the from for a transaction. You will need to reconnect the contract to that signer:
        //https://github.com/ethers-io/ethers.js/issues/1449
        let tx = await deployedAtack.connect(user1).functionAtack(100,{value: valueSend})   

        
        
        const gasUsed :BigNumber = (await tx.wait()).gasUsed
        const gasPrice : BigNumber = tx.gasPrice
        const gasCost : BigNumber = gasUsed.mul(gasPrice)

        expect(valorEsperado.sub(gasCost)).to.equal(await ethers.provider.getBalance(user1.address))         

    })



});