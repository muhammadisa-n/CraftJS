import { spawnSync } from "child_process";
import chalk from "chalk";

export default function DbGenerate(name?: string) {
  console.log(chalk.blue("🚀 Running prisma generate..."));

  // Gunakan shell:true supaya command berjalan lancar di Windows dan Unix
  const result = spawnSync("npx", ["prisma", "generate"], {
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    console.error(chalk.red("❌ Generate failed."));
    // Jika ada error, print detailnya
    if (result.error) {
      console.error(chalk.red(`Error: ${result.error.message}`));
    }
    process.exit(result.status ?? 1);
  } else {
    console.log(chalk.green("✅ Prisma generate completed."));
  }
}
