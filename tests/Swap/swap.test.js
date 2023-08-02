const ethers = require('ethers');

let provider;
let wallet;
let Swap;
let swapContract;
let ERC20Token;
let erc20TokenContract;

const providerUrl = process.env.SEPOLIA_RPC;
const privateKey = `0x${process.env.PRIVATE_KEY}`;
const contractAddress = process.env.SWAP_CONTRACT;
const tokenAddress = process.env.ERC20_CONTRACT;

const slippage = 100; // 2% slippage
const ethAmount = ethers.utils.parseEther('0.001');

beforeAll(async () => {
    provider = new ethers.providers.JsonRpcProvider(providerUrl);
    wallet = new ethers.Wallet(privateKey, provider);

    // Load the Swap contract
    Swap = require('../../artifacts/contracts/Swap.sol/Swap.json');
    swapContract = new ethers.Contract(contractAddress, Swap.abi, wallet);

    // Load the ERC20Token contract
    ERC20Token = require('../../artifacts/contracts/ERC20Token.sol/ERC20Token.json');
    erc20TokenContract = new ethers.Contract(tokenAddress, ERC20Token.abi, wallet);
});


/*
it("Should fund swap contract" , async () => {

    let contractEthBalance = await provider.getBalance(contractAddress);
    contractEthBalance = ethers.utils.formatEther(contractEthBalance);

    if(contractEthBalance < 0.001){
        const balance = await provider.getBalance(wallet.address);

        // Convert the balance to ETH
        const balanceEth = ethers.utils.formatEther(balance);

        const ethToTransfer = 0.1; // 0.1 ETH

        if(balanceEth < ethToTransfer)
            throw new Error("Insufficient Balance to fund the contract");

        // Specify the amount of ETH to transfer to the Swap contract
        const weiToTransfer = ethers.utils.parseEther(ethToTransfer + "");

        // Send the ETH transaction to the Swap contract
        await wallet.sendTransaction({
            to: contractAddress,
            value: weiToTransfer,
            gasLimit: 100000,
        });

    }

} , 30000);*/

/*
it('Should swap ETH for ERC20 token', async () => {
    // Get the initial balance of the ERC20 token
    const initialBalance = await erc20TokenContract.balanceOf(wallet.address);

    // Execute the swap
    // const tx = await swapContract.swapETHToToken(tokenAddress, slippage, deadline, {value: amount});

    // Perform the swap transaction
    const tx = await swapContract.swapETHToToken(tokenAddress, slippage, {
        value: amount,
        gasLimit: 500000
    });
    await tx.wait();

    // Get the final balance of the ERC20 token
    const finalBalance = await erc20TokenContract.balanceOf(wallet.address);

    // Verify the token balance has increased
    expect(finalBalance.gt(initialBalance)).toBe(true);
}, 30000);
*/

/*
it('Should swap ETH for ERC20 token', async () => {
    // Get the initial balance of the ERC20 token
    const initialBalance = await erc20TokenContract.balanceOf(wallet.address);

    console.log({tokenAddress, slippage , amount , initialBalance})
    // Calculate the minimum expected token amount
    const amountOutMin = await swapContract.calculateAmountOutMin(tokenAddress, slippage , amount);
    console.log({amountOutMin})
    // Approve the Swap contract to spend the ERC20 tokens
   /!* erc20TokenContract.approve(swapContract.address, amountOutMin)
        .then((tx) => console.log({tx})).catch((err) => console.log({err}));
*!/
    // Perform the swap transaction
    /!*await swapContract.swapETHToToken(tokenAddress, slippage, {
        amount,
        gasLimit: 500000
    }).then((tx) => console.log({tx})).catch((err) => console.log({err}));
    //await tx.wait();

    // Get the final balance of the ERC20 token
    const finalBalance = await erc20TokenContract.balanceOf(wallet.address);*!/

    // Verify the token balance has increased
    // expect(finalBalance.gt(initialBalance)).toBe(true);
}, 30000);
*/

it("Should approve token contract" , async () => {
    // Approve the Swap contract to spend the ERC20 tokens
    const amountOutMin = await swapContract.calculateAmountOutMin(tokenAddress, slippage , ethAmount);
    console.log({amountOutMin})
    await erc20TokenContract.approve(swapContract.address, amountOutMin);

    // Verify the token allowance has been set correctly
    const allowance = await erc20TokenContract.allowance(wallet.address, swapContract.address);

    console.log({allowance: ethers.utils.formatEther(allowance) , amountOutMin: ethers.utils.formatEther(amountOutMin)})
    expect(ethers.utils.formatEther(allowance)).toEqual(ethers.utils.formatEther(amountOutMin));

} , 30000)

/*
it("Should swap contract has sufficient ETH balance" , async() => {
    // Ensure the swap contract has sufficient ETH balance
    const swapContractEthBalance = await provider.getBalance(swapContract.address);

    expect(parseFloat(ethers.utils.formatEther(swapContractEthBalance))).toBeGreaterThan(parseFloat(ethers.utils.formatEther(ethAmount)));
})
*/


/*
it('Should swap ETH for ERC20 token', async () => {
    // Get the initial balance of the ERC20 token
    const initialBalance = await erc20TokenContract.balanceOf(wallet.address);

    // Execute the swap
    const tx = await swapContract.swapETHToToken(tokenAddress, slippage, {
        value: ethAmount,
        gasLimit: 500000
    });
    await tx.wait();

    // Get the final balance of the ERC20 token
    const finalBalance = await erc20TokenContract.balanceOf(wallet.address);

    // Verify the token balance has increased
    expect(finalBalance.gt(initialBalance)).toBeTruthy();
} , 50000);
*/

