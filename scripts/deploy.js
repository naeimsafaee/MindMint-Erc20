const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    //const Swap = await ethers.getContractFactory("Swap");
    //const swap = await Swap.deploy("0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008" , "0x7b79995e5f793a07bc00c21412e50ecae098e7f9"); // Replace with the address of the deployed Uniswap V2 Router contract
    // const swap = await Swap.deploy("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D" , "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6");
    // await swap.deployed();
    //console.log("Swap contract deployed to:", swap.address);


    const ERC20Token = await ethers.getContractFactory("ERC20Token");
    const token = await ERC20Token.deploy("MindMintStable", "MMS", ethers.utils.parseEther("100000000"));

    console.log("ERC20 Contract deployed to address:", token.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error deploying contract:", error);
        process.exit(1);
    });
