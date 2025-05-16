import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

const toPascalCase = (str: string) =>
  str.replace(/(^\w|-\w)/g, (m) => m.replace("-", "").toUpperCase());

export default function makeController(name: string) {
  if (!name) {
    console.log(chalk.red("❌ Please provide a controller name."));
    return;
  }

  const className = `${toPascalCase(name)}Controller`;
  const fileName = `${name.toLowerCase()}-controller.ts`;
  const targetDir = path.resolve("src", "controllers");

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filePath = path.join(targetDir, fileName);
  if (fs.existsSync(filePath)) {
    console.log(chalk.yellow("⚠️ Controller already exists."));
    return;
  }

  const content = `import { Request, Response } from "express";

export class ${className} {
  async index(req: Request, res: Response) {
    res.status(200).json({
        message: "ok"
    });
  }
}
`;

  fs.writeFileSync(filePath, content);
  console.log(chalk.green(`✅ Controller created at ${filePath}`));
}
