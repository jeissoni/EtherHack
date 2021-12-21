import { ethers } from "hardhat";
import {BigNumber} from "ethers"
import { expect } from 'chai'



describe("CallMeMaybe", function () {

    const CallMeMaybe = async() => {
        const [owner, user1] = await ethers.getSigners();
        const CallMeMaybeContract = await ethers.getContractFactory("CallMeMaybeContract");
        const deployed = await CallMeMaybeContract.deploy();

        const initialBalance : BigNumber = ethers.utils.parseEther("100")

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


    
    it ('fallback function atackContract', async() =>{
        const {deployed, owner, initialBalance} = await CallMeMaybe();

        let balanceDeployed

        const valueSend : BigNumber = ethers.utils.parseEther("10")       

        const tx = await owner.sendTransaction({
            to: deployed.address,
            value: valueSend
        });        
               
        const valueTotal : BigNumber = valueSend.add(initialBalance)

        balanceDeployed = await ethers.provider.getBalance(deployed.address)

        expect(valueTotal).to.equal(balanceDeployed)       
    });  


    
    it('HereIsMyNumber error if call contract' , async()=>{
        const {owner, deployed} = await CallMeMaybe();  

        const testExtcodesizeCallMeMaybe = await ethers.getContractFactory("testExtcodesizeCallMeMaybe");
        const deployedAtack = await testExtcodesizeCallMeMaybe.deploy(deployed.address);

        await expect(deployedAtack.callHereIsMyNumber()).to.be.revertedWith("modifier")

    })

        
    it ('call function', async() =>{
        const {deployed, user1, initialBalance} = await CallMeMaybe();  

        const HackCallMeMaybeContract = await ethers.getContractFactory("HackCallMeMaybeContract");
        const deployedAtack = await HackCallMeMaybeContract.connect(user1).deploy(deployed.address);
        
        let balanceContract2 : BigNumber = await ethers.provider.getBalance(deployedAtack.address)        

        expect(balanceContract2).to.equal(initialBalance)
    });  


});