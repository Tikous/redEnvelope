# 环境变量配置说明

## 创建 .env.local 文件

在 `web` 目录下创建 `.env.local` 文件，内容如下：

```bash
# WalletConnect Project ID (可选，如果不使用WalletConnect可以留空)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=""

# 本地开发环境配置
NEXT_PUBLIC_CHAIN_ID=1337
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:7545
```

## 说明

1. **NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID**: 
   - 如果你需要使用 WalletConnect 功能，需要在 [WalletConnect Cloud](https://cloud.walletconnect.com/) 注册并获取项目ID
   - 如果只使用 MetaMask 等浏览器钱包，可以留空

2. **NEXT_PUBLIC_CHAIN_ID**: 
   - 本地开发网络的链ID，默认为 1337

3. **NEXT_PUBLIC_RPC_URL**: 
   - 本地 Ganache 的 RPC 地址，默认为 http://127.0.0.1:7545

## 注意事项

- `.env.local` 文件已被添加到 `.gitignore`，不会被提交到版本控制
- 所有以 `NEXT_PUBLIC_` 开头的环境变量会被暴露到浏览器端
- 修改环境变量后需要重启开发服务器 