import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

const toPascalCase = (str: string) =>
  str.replace(/(^\w|-\w)/g, (m) => m.replace("-", "").toUpperCase());

export default function makeRepository(name: string) {
  if (!name) {
    console.log(chalk.red("❌ Please provide a repository name."));
    return;
  }

  const className = `${toPascalCase(name)}Repository`;
  const fileName = `${name.toLowerCase()}-repository.ts`;
  const targetDir = path.resolve("src", "repository");

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filePath = path.join(targetDir, fileName);
  if (fs.existsSync(filePath)) {
    console.log(chalk.yellow("⚠️ Repository already exists."));
    return;
  }

  const content = `import { prismaClient } from "../application/database";

export class ${className} {
}
`;

  fs.writeFileSync(filePath, content);
  console.log(chalk.green(`✅ Repository created at ${filePath}`));
}
