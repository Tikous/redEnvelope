# 红包系统 - 基于区块链的红包DApp

这是一个基于以太坊区块链的去中心化红包系统，用户可以发送和抢夺红包。

## 功能特性

- 🧧 **发送红包**: 用户可以创建红包，设置金额、数量和主题
- 💰 **抢夺红包**: 其他用户可以抢夺已发布的红包
- 🎲 **两种模式**: 支持平分红包和拼手气红包
- 🔗 **区块链技术**: 基于以太坊智能合约，保证透明和安全
- 💼 **钱包集成**: 使用ConnectKit支持多种钱包连接

## 技术栈

### 智能合约
- Solidity ^0.8.0
- Truffle框架
- OpenZeppelin库

### 前端
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Wagmi (以太坊React Hooks)
- ConnectKit (钱包连接)
- Viem (以太坊客户端)

## 项目结构

```
redEnvolope/
├── contracts/           # 智能合约
│   └── sendEnvelope.sol # 红包合约
├── migrations/          # 部署脚本
├── web/                # 前端应用
│   ├── app/            # Next.js应用页面
│   ├── components/     # React组件
│   ├── lib/           # 工具库和配置
│   └── public/        # 静态资源
├── build/             # 编译后的合约
└── test/              # 测试文件
```

## 快速开始

### 1. 安装依赖

```bash
# 安装项目依赖
npm install

# 安装前端依赖
cd web
npm install
```

### 2. 编译合约

```bash
# 返回项目根目录
cd ..

# 编译智能合约
truffle compile
```

### 3. 部署合约

#### 本地开发网络 (Ganache)

```bash
# 启动Ganache或其他本地区块链
ganache-cli

# 部署合约到本地网络
truffle migrate --network development
```

#### 测试网络 (Sepolia)

1. 在 `truffle-config.js` 中配置Sepolia网络
2. 获取测试ETH: https://sepoliafaucet.com/
3. 部署合约:

```bash
truffle migrate --network sepolia
```

### 4. 更新合约地址

部署完成后，更新前端配置文件中的合约地址：

```typescript
// web/lib/contracts.ts
export const RED_ENVELOPE_FACTORY_ADDRESS = "你的合约地址" as `0x${string}`;
```

### 5. 启动前端应用

```bash
cd web
npm run dev
```

访问 http://localhost:3000 查看应用。

## 使用说明

### 发送红包

1. 连接你的钱包 (MetaMask等)
2. 点击"发红包"标签
3. 填写红包信息:
   - 红包总金额 (ETH)
   - 红包数量
   - 红包主题
   - 选择分配方式 (平分/拼手气)
4. 确认交易并等待区块确认

### 抢夺红包

1. 连接你的钱包
2. 在"抢红包"页面查看可用红包
3. 点击红包卡片上的"抢红包"按钮
4. 确认交易并等待区块确认
5. 成功后会显示抢到的金额

## 智能合约说明

### RedEnvelope 合约

单个红包合约，包含以下功能：
- `grabEnvelope()`: 抢夺红包
- `getEnvelopeInfo()`: 获取红包信息
- `getGrabbers()`: 获取已抢夺用户列表

### RedEnvelopeFactory 合约

红包工厂合约，管理所有红包：
- `createRedEnvelope()`: 创建新红包
- `getAllRedEnvelopes()`: 获取所有红包地址
- `getUserRedEnvelopes()`: 获取用户创建的红包

## 安全考虑

- 合约使用 `require` 语句进行输入验证
- 防止重复抢夺同一红包
- 随机算法确保拼手气红包的公平性
- 使用 `transfer` 方法安全转账

## 开发和测试

### 运行测试

```bash
truffle test
```

### 代码检查

```bash
cd web
npm run lint
```

### 构建生产版本

```bash
cd web
npm run build
```

## 部署到生产环境

1. 配置环境变量
2. 部署合约到主网
3. 更新前端配置
4. 构建并部署前端应用

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 许可证

MIT License

## 联系方式

如有问题，请创建Issue或联系开发者。 