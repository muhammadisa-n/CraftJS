import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

const toPascalCase = (str: string) =>
  str.replace(/(^\w|-\w)/g, (m) => m.replace("-", "").toUpperCase());

export default function makeResponse(name: string) {
  if (!name) {
    console.log(chalk.red("❌ Please provide a response name."));
    return;
  }

  const typeName = `${toPascalCase(name)}Response`;
  const fileName = `${name.toLowerCase()}-response.ts`;
  const targetDir = path.resolve("src", "response");

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filePath = path.join(targetDir, fileName);
  if (fs.existsSync(filePath)) {
    console.log(chalk.yellow("⚠️ Response type already exists."));
    return;
  }

  const content = `import {  ${toPascalCase(name)} from "@prisma/client";

export type ${typeName} = {
  id: string;
  fullName: string;
  email: string;
  image_id?: string;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
};
`;

  fs.writeFileSync(filePath, content);
  console.log(chalk.green(`✅ Response type created at ${filePath}`));
}
