const fs = require('fs');
const path = require('path');

// 部署后的回调函数，用于更新前端配置
async function updateFrontendConfig(factoryAddress) {
  const contractsPath = path.join(__dirname, '../web/lib/contracts.ts');
  
  try {
    let content = fs.readFileSync(contractsPath, 'utf8');
    
    // 替换合约地址
    content = content.replace(
      /export const RED_ENVELOPE_FACTORY_ADDRESS = ".*" as `0x\${string}`;/,
      `export const RED_ENVELOPE_FACTORY_ADDRESS = "${factoryAddress}" as \`0x\${string}\`;`
    );
    
    fs.writeFileSync(contractsPath, content);
    console.log(`✅ 前端配置已更新，合约地址: ${factoryAddress}`);
  } catch (error) {
    console.error('❌ 更新前端配置失败:', error.message);
  }
}

module.exports = {
  updateFrontendConfig
}; 