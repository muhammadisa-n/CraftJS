#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const inquirer = require('inquirer');

// 👇 Prompt untuk nama project
(async () => {
  const { projectName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Nama folder proyek:',
      default: 'express-prisma-app',
    },
  ]);

  const targetPath = path.resolve(process.cwd(), projectName);
  const templatePath = path.join(__dirname, '..', 'template');

  if (fs.existsSync(targetPath)) {
    console.error(`❌ Folder "${projectName}" sudah ada.`);
    process.exit(1);
  }

  // 👇 Copy template
  const copyRecursiveSync = (src, dest) => {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    fs.mkdirSync(dest, { recursive: true });
    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyRecursiveSync(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  };

  console.log(`🚀 Membuat proyek di ./${projectName}`);
  copyRecursiveSync(templatePath, targetPath);

  // 👇 Buat file .env otomatis
  const envContent = `APP_NAME="${projectName}"
NODE_ENV="development"
TZ="Asia/Jakarta"
DATETIME_FORMAT="dd-MM-yyyy HH:mm:ss"
DATABASE_URL=
BASE_URL=
BASE_API_URL=
PORT=3000
JWT_SECRET_ACCESS_TOKEN=
JWT_SECRET_VERIFY=
JWT_SECRET_REFRESH_TOKEN=
`;

  fs.writeFileSync(path.join(targetPath, '.env'), envContent);
  console.log('📄 File .env dibuat');

  // 👇 Install dependencies
  console.log('📦 Menginstal dependencies...');
  execSync(`cd ${projectName} && npm install`, { stdio: 'inherit' });

  console.log('\n✅ Selesai!');
  console.log(`\nLangkah berikutnya:\n  cd ${projectName}\n  npx prisma migrate dev\n  npm run dev`);
})();
