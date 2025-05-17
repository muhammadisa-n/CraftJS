#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const projectName = process.argv[2];

if (!projectName) {
  console.error("❌ Please provide a project folder name.");
  console.error("Example: npx @muhammadisa226/craftjs@latest my-api");
  process.exit(1);
}

if (!/^[a-zA-Z0-9-_]+$/.test(projectName)) {
  console.error(
    "❌ Project name can only contain letters, numbers, dashes (-), and underscores (_)."
  );
  process.exit(1);
}

const targetPath = path.resolve(process.cwd(), projectName);
const templatePath = path.join(__dirname, "..", "template");

if (fs.existsSync(targetPath)) {
  console.error(`❌ Folder "${projectName}" already exists.`);
  process.exit(1);
}
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

console.log(`🚀 Creating project in ./${projectName}`);
copyRecursiveSync(templatePath, targetPath);

const packageJsonPath = path.join(targetPath, "package.json");
if (fs.existsSync(packageJsonPath)) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  pkg.name = projectName;
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
  console.log(`📦 Updated package.json name to "${projectName}"`);
}

const envContent = `APP_NAME="${projectName}"
NODE_ENV="development"
TZ="Asia/Jakarta"
DATETIME_FORMAT="dd-MM-yyyy HH:mm:ss"
DATABASE_URL="mysql://root:@localhost:3306/${projectName}"
BASE_URL="http://localhost:3000"
BASE_API_URL="http://localhost:3000/api"
PORT=3000
JWT_SECRET_ACCESS_TOKEN=
JWT_SECRET_REFRESH_TOKEN=
`;
const envExampleContent = `APP_NAME="${projectName}"
NODE_ENV="development"
TZ="Asia/Jakarta"
DATETIME_FORMAT="dd-MM-yyyy HH:mm:ss"
DATABASE_URL=
BASE_URL=
BASE_API_URL=
PORT=
JWT_SECRET_ACCESS_TOKEN=
JWT_SECRET_REFRESH_TOKEN=
`;

const sourceReadmePath = path.join(__dirname, "..", "README.md"); // path README di root template
const targetReadmePath = path.join(targetPath, "README.md");

if (fs.existsSync(sourceReadmePath)) {
  fs.copyFileSync(sourceReadmePath, targetReadmePath);
  console.log("📄 README.md file copied from template");
}

console.log(`📦 Generating .env and .env.example files...`);
fs.writeFileSync(path.join(targetPath, ".env"), envContent);
fs.writeFileSync(path.join(targetPath, ".env.example"), envExampleContent);

console.log("🔧 Initializing git repository...");
const gitInit = spawnSync("git", ["init"], {
  cwd: targetPath,
  stdio: "inherit",
});

if (gitInit.status !== 0) {
  console.warn("⚠️ Git initialization failed.");
}

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

console.log("\n✅ Done!");
console.log(
  `\nNext steps:\n cd ${projectName}\n npm install\n npm run craft key:generate\n npm run craft db:generate\n npm run craft db:migrate\n npm run craft dev`
);
