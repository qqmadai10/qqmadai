console.log('========== 调试信息 ==========');
console.log('ZHIPU_API_KEY 是否存在:', !!process.env.ZHIPU_API_KEY);
console.log('ZHIPU_API_KEY 长度:', process.env.ZHIPU_API_KEY ? process.env.ZHIPU_API_KEY.length : 0);
console.log('所有环境变量:', Object.keys(process.env).filter(key => key.includes('ZHIPU')).join(', '));
console.log('==============================');

const fs = require('fs');
const path = require('path');

// 检查环境变量
const apiKey = process.env.ZHIPU_API_KEY;
if (!apiKey) {
  console.error('错误: ZHIPU_API_KEY 环境变量未设置');
  process.exit(1);
}

// 生成绝对唯一的文件名（时间戳+随机数）
const timestamp = Date.now();
const random = Math.floor(Math.random() * 10000);
const apiFileName = `api-${timestamp}-${random}.js`;

// API 函数代码
const apiFunctionCode = `
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.ZHIPU_API_KEY
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: messages,
        stream: true
      })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    res.setHeader('Content-Type', 'text/event-stream');
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value));
    }
    
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
`;

// 写入 dist 目录
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 写入 API 文件
fs.writeFileSync(path.join(distDir, apiFileName), apiFunctionCode);
console.log(`✅ API 函数已生成到 dist/${apiFileName}`);

// 写入配置文件（前端会读取这个文件来知道 API 文件名）
const configCode = `export const API_FILE = '${apiFileName}';`;
fs.writeFileSync(path.join(distDir, 'api-config.js'), configCode);
console.log(`✅ 配置文件已生成到 dist/api-config.js`);

// 写入加载器文件（前端直接引用这个文件）
const loaderCode = `
import { API_FILE } from './api-config.js';

export async function callAPI(messages) {
  const response = await fetch(\`https://qqmadai10.github.io/qqmadai/\${API_FILE}\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });
  return response;
}
`;
fs.writeFileSync(path.join(distDir, 'api-loader.js'), loaderCode);
console.log(`✅ API 加载器已生成到 dist/api-loader.js`);