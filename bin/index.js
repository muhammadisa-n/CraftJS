#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

// Ambil nama project dari argv
const projectName = process.argv[2];

if (!projectName) {
  console.error("❌ Harap masukkan nama folder proyek.");
  console.error("Contoh: npx create-exp-ts-prisma-starter-kit my-app");
  process.exit(1);
}

if (!/^[a-zA-Z0-9-_]+$/.test(projectName)) {
  console.error(
    "❌ Nama proyek hanya boleh huruf, angka, dash (-), dan underscore (_)."
  );
  process.exit(1);
}

const targetPath = path.resolve(process.cwd(), projectName);
const templatePath = path.join(__dirname, "..", "template");

if (fs.existsSync(targetPath)) {
  console.error(`❌ Folder "${projectName}" sudah ada.`);
  process.exit(1);
}

// Copy template ke folder baru
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

// Generate file .env
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

fs.writeFileSync(path.join(targetPath, ".env"), envContent);
fs.writeFileSync(path.join(targetPath, ".env.example"), envContent);

// Tambahkan .gitignore jika belum ada
const gitignorePath = path.join(targetPath, ".gitignore");
if (!fs.existsSync(gitignorePath)) {
  fs.writeFileSync(
    gitignorePath,
    `node_modules
.env
dist
`
  );
}

console.log("\n✅ Selesai!");
console.log(
  `\nLangkah berikutnya:\n  cd ${projectName}\n  npm install\n npx prisma gemerate\n npx prisma migrate dev\n  npm run dev`
);
