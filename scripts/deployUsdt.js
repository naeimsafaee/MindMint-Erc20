const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const TetherToken = await ethers.getContractFactory("TetherToken");

    // Deploying the contract
    const tetherToken = await TetherToken.deploy(
        '100000000000000000000000000', // Replace with the desired initial supply
        "MTether", // Replace with the desired token name
        "MUSD", // Replace with the desired token symbol
        18 ,// Replace with the desired decimals value,
        '0x88C0Ee0aA456ca0F239051653380b29063E5630c'
    );

    // await tetherToken.deployed();

    console.log("Contract deployed at address:", tetherToken.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });