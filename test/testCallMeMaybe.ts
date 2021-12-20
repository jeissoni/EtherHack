import { ethers } from "hardhat";
import {BigNumber} from "ethers"
import { expect } from 'chai'



describe("CallMeMaybe", function () {

    const CallMeMaybe = async() => {
        const [owner, user1] = await ethers.getSigners();
        const CallMeMaybeContract = await ethers.getContractFactory("CallMeMaybeContract");
        const deployed = await CallMeMaybeContract.deploy();

        const initialBalance : BigNumber = ethers.utils.parseEther("10")

        const tx = await owner.sendTransaction({
            to: deployed.address,
            value: initialBalance
        });          

        return{
            owner,
            user1,
            deployed,             
            initialBalance
        }
    }


    
    it ('test fallback function', async() =>{
        const {deployed, owner, initialBalance} = await CallMeMaybe();

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

        
    it ('call function', async() =>{
        const {deployed, owner,user1, initialBalance} = await CallMeMaybe();

        let balanceContrac :BigNumber = await ethers.provider.getBalance(deployed.address)
        let balanceAntes : BigNumber = await ethers.provider.getBalance(user1.address)
        let balanceOwner : BigNumber = await ethers.provider.getBalance(owner.address)

        console.log("Owner balance antes " + ethers.utils.formatEther(balanceOwner))

        console.log("contract balance antes " + ethers.utils.formatEther(balanceContrac))

        console.log("user1 balance antes " + ethers.utils.formatEther(balanceAntes))

        console.log("user1 "+ user1.address)
        // console.log("owner balance " + ethers.utils.formatEther(balanceOwner))

        const HackCallMeMaybeContract = await ethers.getContractFactory("HackCallMeMaybeContract");
        const deployedAtack = await HackCallMeMaybeContract.connect(user1).deploy(deployed.address);

        let balanceDespues : BigNumber = await ethers.provider.getBalance(user1.address)
        console.log("user1 balance despues " + ethers.utils.formatEther(balanceDespues))
    });  


});