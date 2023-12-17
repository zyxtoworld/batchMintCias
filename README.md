# cias 批量自转脚本

## 助记词转私钥
把你的助记词导入小青蛙钱包（leap wallet），然后导出私钥，然后私钥导入keplr钱包，然后就能在keplr看到你的私钥了
leap显示的私钥和keplr的不一样

## 安装
### 安装 nodejs

https://nodejs.org/en/download/

### 安装 yarn
先进入到根目录再执行
```
npm install -g yarn
```
```
yarn install
```

## 配置环境变量
修改 .env.example 为 .env，并填写以下信息：

RPC在这文档里找，记得把端口加上: https://docs.celestia.org/nodes/mainnet
```
NODE_URL=
PRIVATE_KEY=
```

## 钱包批量生成
```
node wallet_gen.js
```

代码里面可以调整生成的个数，执行后会生成一个 celestia_wallets.json 文件

## 批量转账

```
node transfer.js
```
请先执行批量生成，然后再执行批量转账
默认给生成的 celestia_wallets.json 里面所有的地址转 1 个 TIA ，请按需调整

## 批量mint
用 celestia_wallets.json 里的所有地址来 mint，没有的话按相同格式自行添加
```
node index.js
```
