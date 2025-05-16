import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

const toPascalCase = (str: string) =>
  str.replace(/(^\w|-\w)/g, (m) => m.replace("-", "").toUpperCase());

export default function makeValidation(name: string) {
  if (!name) {
    console.log(chalk.red("❌ Please provide a validation name."));
    return;
  }

  const className = `${toPascalCase(name)}Validation`;
  const fileName = `${name.toLowerCase()}-validation.ts`;
  const targetDir = path.resolve("src", "validation");

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filePath = path.join(targetDir, fileName);
  if (fs.existsSync(filePath)) {
    console.log(chalk.yellow("⚠️ Validation already exists."));
    return;
  }

  const content = `import { z, ZodType } from "zod";

export class ${className} {
  static readonly CREATE: ZodType = z.object({
    field1: z.string().min(1, { message: "Field1 wajib diisi" }),
    field2: z.number().optional(),
  });

}
`;

  fs.writeFileSync(filePath, content);
  console.log(chalk.green(`✅ Validation created at ${filePath}`));
}
