const ethers = require('ethers');

// Configuration
const providerUrl = 'https://goerli.infura.io/v3/your-infura-project-id';
const privateKey = 'your-private-key';

const factoryAddress = '0x...'; // UniSwap factory contract address
const tokenAddress = '0x...'; // Address of your ERC20 token contract

// Create a provider and signer
const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const wallet = new ethers.Wallet(privateKey, provider);

// Set up the contract interfaces
const factoryAbi = [
    'event PairCreated(address indexed token0, address indexed token1, address pair, uint256)',
    'function createPair(address tokenA, address tokenB) external returns (address pair)'
];
const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, wallet);

describe('Liquidity Pool Creation', () => {
    it('should create a liquidity pool successfully', async () => {
        // Create a liquidity pool for your token and ETH pair
        const gasLimit = 3000000; // Adjust the gas limit as needed
        const tx = await factoryContract.createPair(tokenAddress, ethers.constants.AddressZero, { gasLimit });
        await tx.wait();

        // Wait for the transaction to be mined
        await factoryContract.provider.waitForTransaction(tx.hash);

        // Retrieve the newly created liquidity pool address
        const filter = factoryContract.filters.PairCreated(null, null, null);
        const events = await factoryContract.queryFilter(filter);

        const liquidityPoolAddress = events[events.length - 1]?.args?.pair;

        expect(liquidityPoolAddress).not.toBeFalsy();
        console.log('Liquidity Pool Address:', liquidityPoolAddress);
    });
});





const { ethers } = require("hardhat");

const providerUrl = process.env.GOERLI_RPC;
const privateKey = `0x${process.env.PRIVATE_KEY}`;

const factoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'; // UniSwap factory contract address
const tokenAddress = process.env.ERC20_CONTRACT;

let provider;
let wallet;
let factoryContract;

describe('Liquidity Pool Creation', () => {

    beforeAll(async () => {
        const [signer] = await ethers.getSigners();
        wallet = signer.address;
        console.log(wallet)
        // provider = new ethers.providers.JsonRpcProvider(providerUrl);
        // wallet = new ethers.Wallet(privateKey, provider);

        // Set up the contract interfaces
        const factoryAbi = [{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
        // const factoryAbi = IUniswapV2Factory.abi;
        factoryContract = new ethers.Contract(factoryAddress, factoryAbi, wallet);

    });

    it('should create a liquidity pool successfully', async () => {
        // Create a liquidity pool for your token and ETH pair
        const tx = await factoryContract.createPair(tokenAddress, ethers.constants.AddressZero, { gasLimit: 30000 });
        await tx.wait();

        console.log({tx})


        /*// Wait for the transaction to be mined
        await factoryContract.provider.waitForTransaction(tx.hash);

        // Retrieve the newly created liquidity pool address
        const filter = factoryContract.filters.PairCreated(null, null, null);
        const events = await factoryContract.queryFilter(filter);

        console.log({events})

        const liquidityPoolAddress = events[events.length - 1]?.args?.pair;

        expect(liquidityPoolAddress).not.toBeFalsy();
        console.log('Liquidity Pool Address:', liquidityPoolAddress);*/
    } , 50000);
});



const tokenAmount = ethers.utils.parseEther('500000');
const ethAmount = ethers.utils.parseEther('0.1');

const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // Set the deadline to 10 minutes from now

const tokenContract = new ethers.Contract(erc20TokenAddress, Erc20TokenABI, signer);

// Call the approve function on the token contract
const approvalTransaction = await tokenContract.approve(uniswapRouterAddress, tokenAmount);

await approvalTransaction.wait();

console.log(`${tokenAmount} tokens approved.`);

// Check the allowance after approval
const allowance = await tokenContract.allowance(wallet.address, uniswapRouterAddress);
console.log(`Allowance: ${allowance.toString()}`);

const uniswapRouterContract = new ethers.Contract(uniswapRouterAddress, UniswapV2Router02ABI, signer);

await uniswapRouterContract.addLiquidityETH(
    erc20TokenAddress, // Address of the ERC20 token
    tokenAmount, // Amount of the ERC20 token
    0, // Minimum amount of the ERC20 token
    ethAmount, // Minimum amount of ETH
    wallet.address, // Address to receive LP tokens
    deadline,
    { value: ethAmount, gasLimit: 600000 }
);

console.log('Liquidity added successfully!');






const ethers = require('ethers');
const UniswapV3RouterABI = require('./uniswapV3RouterABI.json');
const erc20TokenABI = require('./erc20TokenABI.json');

const provider = new ethers.providers.JsonRpcProvider('<Mumbai Network RPC URL>'); // Replace with the Mumbai network RPC URL

const routerAddress = '<Uniswap V3 Router Address>'; // Replace with the Uniswap V3 Router address
const router = new ethers.Contract(routerAddress, UniswapV3RouterABI, provider);

const tokenAddress = '<Your ERC20 Token Address>'; // Replace with the address of your deployed ERC20 token
const token = new ethers.Contract(tokenAddress, erc20TokenABI, provider);

const privateKey = '<Your Ethereum Account Private Key>'; // Replace with your Ethereum account private key

const slippageTolerance = 0.5; // Set your desired slippage tolerance here



const ethers = require('ethers');
const UniswapV3RouterABI = require('./uniswapV3RouterABI.json');
const erc20TokenABI = require('./erc20TokenABI.json');

const provider = new ethers.providers.JsonRpcProvider('<Mumbai Network RPC URL>'); // Replace with the Mumbai network RPC URL

const routerAddress = '<Uniswap V3 Router Address>'; // Replace with the Uniswap V3 Router address
const router = new ethers.Contract(routerAddress, UniswapV3RouterABI, provider);

const tokenAddress = '<Your ERC20 Token Address>'; // Replace with the address of your deployed ERC20 token
const token = new ethers.Contract(tokenAddress, erc20TokenABI, provider);

const privateKey = '<Your Ethereum Account Private Key>'; // Replace with your Ethereum account private key

const slippageTolerance = 0.5; // Set your desired slippage tolerance here

async function createLiquidity() {
    const wallet = new ethers.Wallet(privateKey, provider);
    const account = wallet.connect(provider);

    const tokenAmount = ethers.utils.parseUnits('<Amount of ERC20 Tokens>', '<Token Decimals>'); // Replace with the amount of ERC20 tokens you want to provide as liquidity
    const ethAmount = ethers.utils.parseEther('<Amount of ETH>'); // Replace with the amount of ETH you want to provide as liquidity

    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // Set the deadline for the transaction (10 minutes from now)

    // Step 1: Approve token transfer
    const approvalTx = await token.connect(account).approve(routerAddress, tokenAmount);
    await approvalTx.wait();

    console.log('Token transfer approval successful!');
    console.log('Transaction hash:', approvalTx.hash);

    // Step 2: Create liquidity
    const path = [tokenAddress, routerAddress];

    const params = {
        deadline: deadline,
        amount0Max: tokenAmount,
        amount1Max: ethAmount,
        path: path,
        slippageTolerance: slippageTolerance,
        recipient: wallet.address,
        sqrtPriceLimitX96: 0,
    };

    const transaction = await router.connect(account).exactInputSingle(params);
    const signedTransaction = await wallet.signTransaction(transaction);

    const transactionResponse = await provider.sendTransaction(signedTransaction);
    await transactionResponse.wait();

    console.log('Liquidity created successfully!');
    console.log('Transaction hash:', transactionResponse.hash);
}

createLiquidity();



async function addLiquidity() {
    const tokenAmount = ethers.utils.parseEther('500000');
    const ethAmount = ethers.utils.parseEther('0.001');

    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // Set the deadline to 10 minutes from now

    const allowance = await tokenContract.allowance(wallet.address, uniswapRouterAddress);
    console.log(`Allowance: ${allowance.toString()}`);

    if (allowance < tokenAmount) {
        const approvalTransaction = await tokenContract.approve(uniswapRouterAddress, tokenAmount);
        await approvalTransaction.wait();

        console.log(`${tokenAmount} token approved.`);
    }

    const usdtContract = await ethers.getContractAt(USDTAbi, usdtContractAddress); // Replace with your USDT contract address

    const usdtAmount = ethers.utils.parseUnits('500000', 6); // Replace with the desired USDT amount
    const usdtAllowance = await usdtContract.allowance(wallet.address, uniswapRouterAddress);
    console.log(`USDT Allowance: ${usdtAllowance.toString()}`);

    if (usdtAllowance < usdtAmount) {
        const usdtApprovalTransaction = await usdtContract.approve(uniswapRouterAddress, usdtAmount);
        await usdtApprovalTransaction.wait();

        console.log(`${usdtAmount} USDT approved.`);
    }

    const path = [usdtContractAddress, erc20TokenAddress];
    const amounts = [usdtAmount, tokenAmount];

    const tx = await uniswapRouterContract.addLiquidityETH(
        erc20TokenAddress, // Address of the ERC20 token
        tokenAmount, // Amount of the ERC20 token
        0, // Minimum amount of the ERC20 token
        ethAmount, // Minimum amount of ETH
        wallet.address, // Address to receive LP tokens
        deadline,
        { value: ethAmount, gasLimit: 600000, path, amounts }
    );
    await tx.wait();

    console.log('Liquidity added successfully!');
}









async function addLiquidity() {
    const tokenAmount = ethers.utils.parseEther('500000');
    const ethAmount = ethers.utils.parseEther('0.001');
    const usdtAmount = ethers.utils.parseUnits('500000', 6); // Replace with the desired USDT amount

    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // Set the deadline to 10 minutes from now

    const allowance = await tokenContract.allowance(wallet.address, uniswapRouterAddress);
    console.log(`Allowance: ${allowance.toString()}`);

    if (allowance < tokenAmount) {
        const approvalTransaction = await tokenContract.approve(uniswapRouterAddress, tokenAmount);
        await approvalTransaction.wait();

        console.log(`${tokenAmount} token approved.`);
    }

    const usdtContract = await ethers.getContractAt(USDTAbi, usdtContractAddress); // Replace with your USDT contract address

    const usdtAllowance = await usdtContract.allowance(wallet.address, uniswapRouterAddress);
    console.log(`USDT Allowance: ${usdtAllowance.toString()}`);

    if (usdtAllowance < usdtAmount) {
        const usdtApprovalTransaction = await usdtContract.approve(uniswapRouterAddress, usdtAmount);
        await usdtApprovalTransaction.wait();

        console.log(`${usdtAmount} USDT approved.`);
    }

    const tx = await uniswapRouterContract.addLiquidity(
        erc20TokenAddress, // Address of the ERC20 token
        usdtContractAddress, // Address of the USDT token
        tokenAmount, // Amount of the ERC20 token
        usdtAmount, // Amount of USDT
        0, // Minimum amount of the ERC20 token
        0, // Minimum amount of USDT
        wallet.address, // Address to receive LP tokens
        deadline,
        { gasLimit: 600000 }
    );
    await tx.wait();

    console.log('Liquidity added successfully!');
}


async function swapTokensToUSDT() {
    const amountToSwap = ethers.utils.parseEther('100'); // Replace with the amount of ERC20 tokens you want to swap
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // Set the deadline to 10 minutes from now

    // Approve the ERC20 token allowance for the Uniswap router contract
    const approvalTransaction = await erc20TokenContract.approve(
        uniswapRouterAddress, // Address of the Uniswap router
        amountToSwap
    );
    await approvalTransaction.wait();
    console.log(`${amountToSwap} ERC20 tokens approved for swap.`);

    const path = [erc20TokenAddress, wethAddress, usdtContractAddress]; // Path: ERC20 token -> WETH -> USDT
    const minAmountOut = 0; // Minimum amount of USDT to receive, set to 0 for flexibility

    const swapTransaction = await uniswapRouterContract.swapExactTokensForTokens(
        amountToSwap, // Amount of ERC20 tokens to swap
        minAmountOut, // Minimum amount of USDT to receive
        path,
        wallet.address, // Your wallet address to receive the USDT
        deadline,
        { gasLimit: 600000 }
    );
    await swapTransaction.wait();
    console.log(`${amountToSwap} ERC20 tokens swapped for USDT successfully!`);
}

