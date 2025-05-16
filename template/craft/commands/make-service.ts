import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

const toPascalCase = (str: string) =>
  str.replace(/(^\w|-\w)/g, (m) => m.replace("-", "").toUpperCase());

export default function makeService(name: string) {
  if (!name) {
    console.log(chalk.red("❌ Please provide a service name."));
    return;
  }

  const className = `${toPascalCase(name)}Service`;
  const fileName = `${name.toLowerCase()}-service.ts`;
  const targetDir = path.resolve("src", "services");

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filePath = path.join(targetDir, fileName);
  if (fs.existsSync(filePath)) {
    console.log(chalk.yellow("⚠️ Service already exists."));
    return;
  }

  const content = `export class ${className} {
  async doSomething() {
    return "Service ${className} is working";
  }
}
`;

  fs.writeFileSync(filePath, content);
  console.log(chalk.green(`✅ Service created at ${filePath}`));
}
