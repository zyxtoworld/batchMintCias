const fs = require('fs');
const bip39 = require("bip39");
const { crypto } = require("cosmos-lib");
const {DirectSecp256k1Wallet} = require("@cosmjs/proto-signing");

async function generateCosmosWallets(numberOfWallets) {
    let walletData = [];

    for (let i = 0; i < numberOfWallets; i++) {
        const mnemonic = bip39.generateMnemonic();
        const keys = crypto.getKeysFromMnemonic(mnemonic);
        const wallet = await DirectSecp256k1Wallet.fromKey(Buffer.from(keys.privateKey), "celestia");
        const [account] = await wallet.getAccounts();
        const walletAddress = account.address;
        walletData.push({
            address: walletAddress,
            mnemonic: mnemonic,
            privateKey: keys.privateKey.toString('hex')
        });
    }

    fs.writeFileSync('celestia_wallets.json', JSON.stringify(walletData, null, 4));
}

generateCosmosWallets(100).then(() => {
    console.log("Wallets generated and saved to celestia_wallets.json");
});
