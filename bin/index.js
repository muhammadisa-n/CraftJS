#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
};

(async () => {
  console.log("🚀 Welcome to CraftJS Project Creator!");

  let projectName = process.argv[2];

  if (!projectName) {
    projectName = await ask("📦 Enter your project name: ");
    while (!projectName || !/^[a-zA-Z0-9-_]+$/.test(projectName)) {
      console.log(
        "❌ Invalid project name. Use only letters, numbers, - and _."
      );
      projectName = await ask("📦 Enter your project name: ");
    }
  } else {
    if (!/^[a-zA-Z0-9-_]+$/.test(projectName)) {
      console.error(
        "❌ Project name can only contain letters, numbers, dashes (-), and underscores (_)."
      );
      rl.close();
      process.exit(1);
    }
  }

  const targetPath = path.resolve(process.cwd(), projectName);
  const templatePath = path.join(__dirname, "..", "template");

  if (fs.existsSync(targetPath)) {
    console.error(`❌ Folder "${projectName}" already exists.`);
    rl.close();
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

  console.log(`\n🚧 Creating project in ./${projectName}...`);
  copyRecursiveSync(templatePath, targetPath);

  const packageJsonPath = path.join(targetPath, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    pkg.name = projectName;
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
    console.log(`📦 Updated package.json name to "${projectName}"`);
  }

  const envContent = `APP_NAME="${projectName}"
APP_SECRET=
NODE_ENV="development"
TZ="Asia/Jakarta"
DATETIME_FORMAT="dd-MM-yyyy HH:mm:ss"
DATABASE_URL="mysql://root:@localhost:3306/${projectName}"
BASE_URL="http://localhost:4444"
BASE_API_URL="http://localhost:4444/api"
PORT=4444
JWT_SECRET=
`;

  const envExampleContent = envContent.replace(/=.*/g, "=");

  const sourceReadmePath = path.join(__dirname, "..", "README.md");
  const targetReadmePath = path.join(targetPath, "README.md");

  if (fs.existsSync(sourceReadmePath)) {
    fs.copyFileSync(sourceReadmePath, targetReadmePath);
    console.log("📄  Copied README.md...");
  }

  console.log("📝 Generating .env and .env.example...");
  fs.writeFileSync(path.join(targetPath, ".env"), envContent);
  fs.writeFileSync(path.join(targetPath, ".env.example"), envExampleContent);

  console.log("🔧 Initializing git repository...");
  const gitInit = spawnSync("git", ["init"], {
    cwd: targetPath,
    stdio: "inherit",
    shell: true,
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

  const installNow = await ask(
    "📥 Do you want to install dependencies now? (yes/no): "
  );
  if (installNow.toLowerCase() === "yes" || installNow.toLowerCase() === "y") {
    console.log("📦 Installing dependencies...");
    const npmInstall = spawnSync("npm", ["install"], {
      cwd: targetPath,
      stdio: "inherit",
      shell: true,
    });

    if (npmInstall.status !== 0) {
      console.warn("⚠️ npm install failed.");
      console.log("\n✅ Done!");
      console.log(
        `\nNext steps:\n cd ${projectName}\n npm install\n node craft key:generate\n node craft db:generate\n node craft db:migrate\n node craft dev`
      );
    } else {
      console.log("✅ Dependencies installed successfully.");
      console.log("\n✅ Done!");
      console.log(
        `\nNext steps:\n cd ${projectName}\n node craft key:generate\n node craft db:generate\n node craft db:migrate\n node craft dev`
      );
    }
  } else {
    console.log("ℹ️ Skipping dependency installation.");
    console.log("\n✅ Done!");
    console.log(
      `\nNext steps:\n cd ${projectName}\n npm install\n node craft key:generate\n node craft db:generate\n node craft db:migrate\n node craft dev`
    );
  }

  rl.close();
})();
