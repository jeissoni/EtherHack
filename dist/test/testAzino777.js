"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const chai_1 = require("chai");
describe("Token", function () {
    const setupAzio777 = async () => {
        const [owner, user1, userFond] = await hardhat_1.ethers.getSigners();
        const azino777 = await hardhat_1.ethers.getContractFactory("Azino777");
        const deployed = await azino777.deploy();
        const AtackAzino777 = await hardhat_1.ethers.getContractFactory("AtackAzino777");
        const deployedAtack = await AtackAzino777.deploy(deployed.address);
        const initialBalance = hardhat_1.ethers.utils.parseEther("10");
        const tx = await userFond.sendTransaction({
            to: deployed.address,
            value: initialBalance
        });
        return {
            owner,
            user1,
            deployed,
            deployedAtack,
            initialBalance
        };
    };
    it('test fallback function', async () => {
        const { deployed, owner, initialBalance } = await setupAzio777();
        let balanceDeployed;
        const valueSend = hardhat_1.ethers.utils.parseEther("10");
        //await ethers.provider.getBalance(owner.address)        
        //balanceDeployed = await ethers.provider.getBalance(deployed.address)
        //balanceOwner = await ethers.provider.getBalance(owner.address)      
        const tx = await owner.sendTransaction({
            to: deployed.address,
            value: valueSend
        });
        const valueTotal = valueSend.add(initialBalance);
        //console.log(tx)
        balanceDeployed = await hardhat_1.ethers.provider.getBalance(deployed.address);
        (0, chai_1.expect)(valueTotal).to.equal(balanceDeployed);
    });
    it('test actak smartContract', async () => {
        //1. enviar eth
        //2. calcular numero ramdom 
        //3. ejecutar contrato 
        //4. ganar 
        const { owner, user1, initialBalance, deployedAtack, deployed } = await setupAzio777();
        //onst currentBlocknNumber = await ethers.provider.getBlockNumber();     
        console.log("balance inicial:" + hardhat_1.ethers.utils.formatEther(initialBalance));
        //10000
        console.log("user1 :" + hardhat_1.ethers.utils.formatEther(await hardhat_1.ethers.provider.getBalance(user1.address)));
        //10
        console.log("balance Contract :" + hardhat_1.ethers.utils.formatEther(await hardhat_1.ethers.provider.getBalance(deployed.address)));
        let valorEnviado = hardhat_1.ethers.utils.parseEther("1");
        let balancesetupAzio777 = await hardhat_1.ethers.provider.getBalance(user1.address);
        //3.
        //You cannot change the from for a transaction. You will need to reconnect the contract to that signer:
        //https://github.com/ethers-io/ethers.js/issues/1449
        let tx = await deployedAtack.connect(user1).rand({ value: valorEnviado });
        console.log("user1 - segunda vez :" + hardhat_1.ethers.utils.formatEther(await hardhat_1.ethers.provider.getBalance(user1.address)));
        console.log("balance Contract - segunda vez:" + hardhat_1.ethers.utils.formatEther(await hardhat_1.ethers.provider.getBalance(deployed.address)));
        const valorEsperado = initialBalance.add(balancesetupAzio777);
        console.log("valor esperado en eht: " + hardhat_1.ethers.utils.formatEther(valorEsperado));
        //console.log("balance user1: " +  ethers.utils.formatEther(balancesetupAzio777))
        //console.log("balance user1 + ganancia: " + ethers.utils.formatEther(valorEsperado) )
        (0, chai_1.expect)(valorEsperado).to.equal(balancesetupAzio777);
        // console.log("owner: "+ ownerAtack.address)
        // console.log("owner: "+ ownerAtack2.address)
        // console.log("deploy: " +deployedAtack.address)
    });
});
