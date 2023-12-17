require('dotenv').config();
const { SigningStargateClient, GasPrice, coins } = require("@cosmjs/stargate");
const { DirectSecp256k1Wallet } = require('@cosmjs/proto-signing');
const {readFileSync} = require("fs");

async function main() {
    const rpcEndpoint = process.env.NODE_URL;
    const privateKey = process.env.PRIVATE_KEY; //主账户私钥
    const wallet = await DirectSecp256k1Wallet.fromKey(Buffer.from(privateKey, "hex"), "celestia");
    const [account] = await wallet.getAccounts();
    const gasPrice = GasPrice.fromString("0.025utia");
    const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, { gasPrice: gasPrice });
    const balance = await client.getBalance(account.address, "utia");
    console.log(`主账户地址: ${account.address} 余额: ${parseFloat(balance.amount) / 1000000}`);
    const wallets = JSON.parse(readFileSync('celestia_wallets.json', 'utf-8'));
    const recipients = wallets.map(wallet => wallet.address);

    // 1 tia 等于 1000000 utia
    const amount = coins(1000000, "utia");
    for (const recipient of recipients) {
        try {
            const fee = {
                amount: coins(400, "utia"),
                gas: "100000",
            };
            const result = await client.sendTokens(account.address, recipient, amount, fee);
            if(result.code === 0) {
                console.log(`${recipient}: 转账 ${amount.toString()} 成功: ${'https://www.mintscan.io/celestia/tx/' + result.transactionHash}`);
            } else {
                console.log(`${recipient}: 转账 ${amount.toString()} 失败: ${'https://www.mintscan.io/celestia/tx/' + result.transactionHash}`);
            }
        } catch (error) {
            console.error(`转账给 ${recipient} 失败: `, error);
        }
    }
}

main();
