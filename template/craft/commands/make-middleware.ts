import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

const toPascalCase = (str: string) =>
  str.replace(/(^\w|-\w)/g, (m) => m.replace("-", "").toUpperCase());

export default function makeMiddleware(name: string) {
  if (!name) {
    console.log(chalk.red("❌ Please provide a middleware name."));
    return;
  }

  const className = `${toPascalCase(name)}Middleware`;
  const fileName = `${name.toLowerCase()}-middleware.ts`;
  const targetDir = path.resolve("src", "middleware");

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filePath = path.join(targetDir, fileName);
  if (fs.existsSync(filePath)) {
    console.log(chalk.yellow("⚠️ Middleware already exists."));
    return;
  }

  const content = `import { NextFunction, Request, Response } from "express";

export const ${className} = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next();
};
`;

  fs.writeFileSync(filePath, content);
  console.log(chalk.green(`✅ Middleware created at ${filePath}`));
}
