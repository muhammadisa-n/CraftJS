import { spawnSync } from "child_process";
import chalk from "chalk";

export default function RunTest() {
  console.log(chalk.blue("🧪 Running tests..."));

  const result = spawnSync("npx", ["jest", "-i"], {
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    console.error(chalk.red("❌ Tests failed."));
    process.exit(result.status ?? 1);
  } else {
    console.log(chalk.green("✅ Tests passed."));
  }
}
