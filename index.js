require('dotenv').config();
const { SigningStargateClient, GasPrice, coins } = require("@cosmjs/stargate");
const { DirectSecp256k1Wallet } = require('@cosmjs/proto-signing');
const { readFileSync } = require("fs");
const {base64FromBytes} = require("cosmjs-types/helpers");

async function performTransaction(walletInfo, numberOfTimes) {
    const rpcEndpoint = process.env.NODE_URL;
    const gasPrice = GasPrice.fromString("0.025utia");
    const wallet = await DirectSecp256k1Wallet.fromKey(Buffer.from(walletInfo.privateKey, "hex"), "celestia");
    const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, { gasPrice: gasPrice });
    const fee = {
        amount: coins(400, "utia"),
        gas: "80000",
    };
    for (let i = 0; i < numberOfTimes; i++) {
        try {
            const [account] = await wallet.getAccounts();
            const amount = coins(1, "utia");
            const memo = 'data:,{"op":"mint","amt":10000,"tick":"cias","p":"cia-20"}';
            const result = await client.sendTokens(account.address, account.address, amount, fee, base64FromBytes(Buffer.from(memo, 'utf8')));
            if(result.code === 0) {
                console.log(`${account.address}, 第 ${i + 1} 次操作成功: ${'https://www.mintscan.io/celestia/tx/' + result.transactionHash}`);
            } else {
                console.log(`${account.address}, 第 ${i + 1} 次操作失败: ${'https://www.mintscan.io/celestia/tx/' + result.transactionHash}`);
            }
        } catch (error) {
            console.error(`第 ${i + 1} 次操作失败: `, error);
        }
    }
}

async function main() {
    let walletData = [];
    try {
        walletData = JSON.parse(readFileSync('celestia_wallets.json', 'utf-8'));
    } catch (e) {
        console.log('未找到 celestia_wallets.json,使用配置的主钱包');
    }
    //const privateKey = process.env.PRIVATE_KEY;
    //const wallet = await DirectSecp256k1Wallet.fromKey(Buffer.from(privateKey, "hex"), "cosmos");
    //const [account] = await wallet.getAccounts();
    //const walletAddress = account.address;

    //const client = await SigningStargateClient.connectWithSigner(process.env.NODE_URL, wallet);
    //const balance = await client.getBalance(walletAddress, "uatom");
    //console.log(`地址: ${walletAddress} 余额: ${parseFloat(balance.amount) / 1000000}`);
    //walletData.push(    {
    //    "address": walletAddress,
    //    "privateKey": privateKey
    //});
    Promise.all(walletData.map(wallet => performTransaction(wallet, 10000)))
        .then(() => {
            console.log("所有操作完成");
        })
        .catch(error => {
            console.error("操作中有错误发生: ", error);
        });
}

main();
