// 方法派电影级表情工坊 - 版本发布与云端同步工具 (release.js)
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 辅助函数：执行 shell 命令
function runCmd(cmd) {
  try {
    return execSync(cmd, { cwd: rootDir, encoding: 'utf8' }).trim();
  } catch (err) {
    console.error(`❌ 执行命令失败: ${cmd}`);
    console.error(err.message);
    process.exit(1);
  }
}

// 1. 获取命令行参数
const args = process.argv.slice(2);
const changelog = args.join(' ');

if (!changelog) {
  console.log('🎭 用法: node scripts/release.js "<本次更新的具体内容>"');
  console.log('示例: node scripts/release.js "优化了假笑微表情的眼轮匝肌收缩参数，修复了移动端排版换行"');
  process.exit(0);
}

console.log('🎬 正在启动 MethodActor-Studio 自动化发布流程...\n');

// 2. 读取当前版本号并计算新版本号
const readmePath = path.join(rootDir, 'README.md');
const skillPath = path.join(rootDir, 'SKILL.md');

if (!fs.existsSync(readmePath)) {
  console.error('❌ 未找到 README.md，请确保在项目根目录运行！');
  process.exit(1);
}

let readmeContent = fs.readFileSync(readmePath, 'utf8');
const versionRegex = /> v(\d+)\.(\d+)\.(\d+)/;
const match = readmeContent.match(versionRegex);

if (!match) {
  console.error('❌ 在 README.md 中未找到符合格式的版本标记（如: > v1.0.0）');
  process.exit(1);
}

const major = parseInt(match[1]);
const minor = parseInt(match[2]);
const patch = parseInt(match[3]);

// 默认进行 Patch 级别升级 (例如 1.0.0 -> 1.0.1)
const newPatch = patch + 1;
const newVersion = `v${major}.${minor}.${newPatch}`;
const oldVersion = `v${major}.${minor}.${patch}`;

console.log(`📈 版本晋升: ${oldVersion} ➔ ${newVersion}`);

// 3. 更新 README.md 中的版本号与日期
const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const oldMatchStr = match[0] + readmeContent.slice(match.index + match[0].length).split('\n')[0];
const newMatchStr = `> ${newVersion} | ${today}`;

readmeContent = readmeContent.replace(oldMatchStr, newMatchStr);
fs.writeFileSync(readmePath, readmeContent, 'utf8');
console.log('📝 README.md 版本号已更新。');

// 4. 更新 SKILL.md 中的版本号 (如果存在符合描述的字样)
if (fs.existsSync(skillPath)) {
  let skillContent = fs.readFileSync(skillPath, 'utf8');
  // 如果 SKILL.md 有版本声明，进行同步替换
  const skillVersionRegex = /version: (\d+)\.(\d+)\.(\d+)/;
  if (skillContent.match(skillVersionRegex)) {
    skillContent = skillContent.replace(skillVersionRegex, `version: ${major}.${minor}.${newPatch}`);
    fs.writeFileSync(skillPath, skillContent, 'utf8');
    console.log('📝 SKILL.md 版本号已同步更新。');
  }
}

// 5. 执行 Git 提交并推送
console.log('\n⚙️ 正在执行 Git 同步...');
runCmd('git add .');

const commitMsg = `release: ${newVersion} - ${changelog}`;
runCmd(`git commit -m "${commitMsg}"`);
console.log(`✓ 本地 commit 成功: "${commitMsg}"`);

console.log('📡 正在推送至 GitHub 远程仓库 (origin main)...');
const pushResult = runCmd('git push origin main');
console.log(pushResult);
console.log(`\n🎉 发布成功！云端已同步更新至 ${newVersion}。`);
console.log(`📢 更新日志已烘焙入 commit。`);
