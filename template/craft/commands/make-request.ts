import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

const toPascalCase = (str: string) =>
  str.replace(/(^\w|-\w)/g, (m) => m.replace("-", "").toUpperCase());

export default function makeRequest(name: string) {
  if (!name) {
    console.log(chalk.red("❌ Please provide a request name."));
    return;
  }

  const typeName = `${toPascalCase(name)}Request`;
  const fileName = `${name.toLowerCase()}-request.ts`;
  const targetDir = path.resolve("src", "request");

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filePath = path.join(targetDir, fileName);
  if (fs.existsSync(filePath)) {
    console.log(chalk.yellow("⚠️ Request type already exists."));
    return;
  }

  const content = `export type ${typeName} = {
  field1: string;
  field2?: string;   // optional

};
`;

  fs.writeFileSync(filePath, content);
  console.log(chalk.green(`✅ Request type created at ${filePath}`));
}
