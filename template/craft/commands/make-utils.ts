import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

export default function makeUtils(name: string) {
  if (!name) {
    console.log(chalk.red("❌ Please provide a utils name."));
    return;
  }

  const fileName = `${name.toLowerCase()}.ts`;
  const targetDir = path.resolve("src", "utils");

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filePath = path.join(targetDir, fileName);
  if (fs.existsSync(filePath)) {
    console.log(chalk.yellow("⚠️ Utils already exists."));
    return;
  }

  const content = ``;

  fs.writeFileSync(filePath, content);
  console.log(chalk.green(`✅ Utils created at ${filePath}`));
}
