#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🧧 红包系统启动脚本');
console.log('==================');

// 检查是否在正确的目录
const packageJsonPath = path.join(__dirname, 'package.json');
const webPackageJsonPath = path.join(__dirname, 'web', 'package.json');

try {
  require(packageJsonPath);
  require(webPackageJsonPath);
} catch (error) {
  console.error('❌ 请在项目根目录运行此脚本');
  process.exit(1);
}

console.log('1. 编译智能合约...');
const compile = spawn('truffle', ['compile'], { stdio: 'inherit' });

compile.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ 合约编译失败');
    process.exit(1);
  }
  
  console.log('✅ 合约编译成功');
  console.log('\n2. 启动前端开发服务器...');
  
  const dev = spawn('npm', ['run', 'dev'], { 
    cwd: path.join(__dirname, 'web'),
    stdio: 'inherit' 
  });
  
  dev.on('close', (code) => {
    console.log(`前端服务器退出，代码: ${code}`);
  });
});

compile.on('error', (error) => {
  console.error('❌ 启动失败:', error.message);
  console.log('\n请确保已安装 Truffle:');
  console.log('npm install -g truffle');
}); 