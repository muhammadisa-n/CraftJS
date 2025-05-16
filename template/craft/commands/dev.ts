import { spawnSync } from "child_process";
import chalk from "chalk";

export default function Dev() {
  console.log(chalk.blue("🚀 Starting development server with nodemon..."));
  const result = spawnSync("nodemon", ["./src/main.ts"], {
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    console.error(chalk.red("❌ Failed to start development server."));
    process.exit(result.status ?? 1);
  }
}
