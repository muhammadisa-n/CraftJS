import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

const toPascalCase = (str: string) =>
  str.replace(/(^\w|-\w)/g, (m) => m.replace("-", "").toUpperCase());

export default function makeCommand(name: string) {
  if (!name) {
    console.log(chalk.red("❌ Please provide a command name."));
    return;
  }

  const className = toPascalCase(name);
  const fileName = `${name.toLowerCase()}.ts`;
  const targetDir = path.resolve("craft", "commands");

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filePath = path.join(targetDir, fileName);
  if (fs.existsSync(filePath)) {
    console.log(chalk.yellow("⚠️ Command already exists."));
    return;
  }

  const content = `import chalk from "chalk";

export default function ${className}(name?: string) {
  console.log(chalk.green("✅ Running custom command: ${className}"));
  if (name) {
    console.log(chalk.blue("Parameter received:"), name);
  } else {
    console.log(chalk.yellow("No parameter provided."));
  }
}
`;

  fs.writeFileSync(filePath, content);
  console.log(chalk.green(`✅ Command created at ${filePath}`));
}
