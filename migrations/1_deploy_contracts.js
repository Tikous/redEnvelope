const RedEnvelopeFactory = artifacts.require("RedEnvelopeFactory");
const { updateFrontendConfig } = require("../scripts/deploy");

module.exports = function(deployer) {
    deployer.deploy(RedEnvelopeFactory).then(async (instance) => {
        console.log(`🎉 RedEnvelopeFactory 部署成功!`);
        console.log(`📍 合约地址: ${instance.address}`);
        
        // 更新前端配置
        await updateFrontendConfig(instance.address);
        
        console.log(`\n🚀 部署完成! 现在你可以:`);
        console.log(`1. cd web`);
        console.log(`2. npm run dev`);
        console.log(`3. 访问 http://localhost:3000`);
    });
};
