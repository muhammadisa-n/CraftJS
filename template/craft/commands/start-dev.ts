import { spawnSync } from "child_process";
import chalk from "chalk";
import fs from "fs";
import path from "path";

export default function StartDev() {
  const entryPoint = path.resolve("dist/src/main.js");

  if (!fs.existsSync(entryPoint)) {
    console.error(
      chalk.red(
        `❌ Build file not found: ${entryPoint}\nPlease run 'npm run build' before starting the dev server.`
      )
    );
    process.exit(1);
  }

  console.log(chalk.blue("🚀 Starting production server with nodemon..."));
  const result = spawnSync("nodemon", [entryPoint], {
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    console.error(
      chalk.red("❌ Failed to start production server with nodemon.")
    );
    process.exit(result.status ?? 1);
  }
}
