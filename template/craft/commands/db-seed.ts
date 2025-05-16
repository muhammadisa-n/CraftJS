import { spawnSync } from "child_process";
import chalk from "chalk";

export default function DbSeed(name?: string) {
  console.log(chalk.blue("🚀 Seeding database..."));

  const result = spawnSync("tsx", ["prisma/seed.ts"], {
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    console.error(chalk.red("❌ Seed failed."));
    if (result.error) {
      console.error(chalk.red(`Error: ${result.error.message}`));
    }
    process.exit(result.status ?? 1);
  } else {
    console.log(chalk.green("✅ Seed completed."));
  }
}
