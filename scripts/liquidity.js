require("dotenv").config();
const { ethers } = require('ethers');

const UniswapV2FactoryABI = require("./ABI/UniswapV2Factory.json");
const UniswapV2Router02ABI = require('./ABI/UniswapV2Router02.json');
const UniswapV2PairABI = require('./ABI/UniswapV2Pair.json');

const Erc20TokenABI = require('../artifacts/contracts/ERC20Token.sol/ERC20Token.json').abi;
const USDTABI = require('../artifacts/contracts/ERC20Token.sol/ERC20Token.json').abi;


const erc20TokenAddress = process.env.ERC20_CONTRACT;
const USDTAddress = process.env.TETHER_CONTRACT;
const WETH_ADDRESS = process.env.WETH_ADDRESS;

const factoryAddress = process.env.UNISWAP_FACTORY_ADDRESS;
const uniswapRouterAddress = process.env.UNISWAP_ROUTER_ADDRESS;
const pairAddress = process.env.UNISWAP_PAIR_ADDRESS;


const ethersProvider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC);
const wallet = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`, ethersProvider);
const signer = wallet.connect(ethersProvider);

const tokenContract = new ethers.Contract(erc20TokenAddress, Erc20TokenABI, signer);
const usdtContract = new ethers.Contract(USDTAddress, USDTABI, signer);

const uniswapRouterContract = new ethers.Contract(uniswapRouterAddress, UniswapV2Router02ABI, signer);
const pairContract = new ethers.Contract(pairAddress, UniswapV2PairABI, ethersProvider);
const factoryContract = new ethers.Contract(factoryAddress, UniswapV2FactoryABI, ethersProvider);


async function addLiquidity() {
    const tokenAmount = ethers.utils.parseEther('500000');
    const ethAmount = ethers.utils.parseEther('0.001');

    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

    const allowance = await tokenContract.allowance(wallet.address, uniswapRouterAddress);
    console.log(`Allowance: ${allowance.toString()}`);

    if (allowance < tokenAmount) {
        const approvalTransaction = await tokenContract.approve(uniswapRouterAddress, tokenAmount);
        await approvalTransaction.wait();

        console.log(`${tokenAmount} token approved.`);
    }

    //add eth amount
    const tx = await uniswapRouterContract.addLiquidityETH(
        erc20TokenAddress, // Address of the ERC20 token
        tokenAmount, // Amount of the ERC20 token
        0, // Minimum amount of the ERC20 token
        ethAmount, // Minimum amount of ETH
        wallet.address, // Address to receive LP tokens
        deadline,
        { value: ethAmount, gasLimit: 600000 }
    );


    await tx.wait();

    console.log('Liquidity added successfully!');
}

async function addUsdtLiquidity() {
    const tokenAmount = ethers.utils.parseEther('50000');
    const ethAmount = ethers.utils.parseEther('0.001');

    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

    const allowance = await usdtContract.allowance(wallet.address, uniswapRouterAddress);
    console.log(`Allowance: ${allowance.toString()}`);

    if (allowance < tokenAmount) {
        console.log(`approving`);

        const approvalTransaction = await usdtContract.approve(uniswapRouterAddress, tokenAmount );
        await approvalTransaction.wait();

        console.log(`${tokenAmount} usdt approved.`);
    }

    //add eth amount
    const tx = await uniswapRouterContract.addLiquidityETH(
        USDTAddress, // Address of the ERC20 token
        tokenAmount, // Amount of the ERC20 token
        0, // Minimum amount of the ERC20 token
        ethAmount, // Minimum amount of ETH
        wallet.address, // Address to receive LP tokens
        deadline,
        { value: ethAmount, gasLimit: 600000 }
    );
    await tx.wait();

    console.log('Liquidity added successfully!');
}


async function swapETHForTokens() {

    const amountIn = ethers.utils.parseEther("0.01");
    const amountOutMin = ethers.utils.parseEther("0");

    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // Set the deadline to 10 minutes from now

    // Perform the ETH to token swap
    const tx = await uniswapRouterContract.swapExactETHForTokens(
        amountOutMin,
        [ethers.utils.getAddress(WETH_ADDRESS), erc20TokenAddress], // Use ethers.utils.getAddress() to convert WETH_ADDRESS to checksum address
        wallet.address,
        deadline,
        { value: amountIn , gasLimit: 600000 } // Convert ETH amount to Wei using ethers.utils.parseEther()
    );
    await tx.wait();

    console.log('ETH to token swap completed successfully!');
}

async function swapTokensForETH() {

    const amountIn = ethers.utils.parseEther('20000');
    const amountOutMin = ethers.utils.parseEther('0');

    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // Set the deadline to 10 minutes from now

    // Approve the Uniswap Router to spend the tokenIn
    await tokenContract.approve(uniswapRouterAddress, amountIn);

    // Perform the token to ETH swap
    const tx = await uniswapRouterContract.swapExactTokensForETH(
        amountIn,
        amountOutMin,
        [ethers.utils.getAddress(erc20TokenAddress), WETH_ADDRESS],
        wallet.address,
        deadline , {gasLimit: 600000}
    );
    await tx.wait();

    console.log('Token to ETH swap completed successfully!');
}

async function checkLiquidityBalance() {
    try {
        const reserves = await pairContract.getReserves();
        const token0 = await pairContract.token0();
        const token1 = await pairContract.token1();

        console.log('Token 0 Address:', token0);
        console.log('Token 0 Reserve:', ethers.utils.formatEther(reserves[0]).toString());

        console.log('Token 1 Address:', token1);
        console.log('Token 1 Reserve:', ethers.utils.formatEther(reserves[1]).toString());
    } catch (error) {
        console.error('Failed to check liquidity balance:', error);
    }
}

async function findPairContractAddress() {
    try {
        const pairAddress = await factoryContract.getPair(erc20TokenAddress, WETH_ADDRESS);
        console.log('Pair Contract Address:', pairAddress);
    } catch (error) {
        console.error('Failed to find pair contract address:', error);
    }
}

async function swapERC20Tokens() {
    const amountToSwap = ethers.utils.parseEther('10000'); // Replace with the amount of ERC20 tokens you want to swap
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // Set the deadline to 10 minutes from now

    // Approve the ERC20 token allowance for the Uniswap router contract
    const approvalTransaction = await tokenContract.approve(
        uniswapRouterAddress, // Address of the Uniswap router
        amountToSwap
    );
    await approvalTransaction.wait();
    console.log(`${amountToSwap} ERC20 tokens approved for swap.`);

    const path = [erc20TokenAddress, USDTAddress]; // Path: ERC20 token 1 to ERC20 token 2
    const minAmountOut = 0; // Minimum amount of ERC20 token 2 to receive, set to 0 for flexibility

    const swapTransaction = await uniswapRouterContract.swapExactTokensForTokens(
        amountToSwap, // Amount of ERC20 token 1 to swap
        minAmountOut, // Minimum amount of ERC20 token 2 to receive
        path,
        wallet.address, // Your wallet address to receive the ERC20 token 2
        deadline,
        { gasLimit: 600000 }
    );
    await swapTransaction.wait();
    console.log(`${amountToSwap} ERC20 tokens swapped to ERC20 token 2 successfully!`);
}

// swapTokensToUSDT().catch(console.error);
// findPairContractAddress().catch(console.error);
// checkLiquidityBalance().catch(console.error);
// swapTokensForETH().catch(console.error);
// swapETHForTokens().catch(console.error);
// addLiquidity().catch(console.error);
addUsdtLiquidity().catch(console.error);
