import { spawnSync } from "child_process";
import chalk from "chalk";

export default function Build() {
  console.log(chalk.blue("📦 Building project..."));

  const result = spawnSync("tsc", [], {
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    console.error(chalk.red("❌ Build failed."));
    process.exit(result.status ?? 1);
  } else {
    console.log(chalk.green("✅ Build completed successfully."));
  }
}
