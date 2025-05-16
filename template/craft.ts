#!/usr/bin/env ts-node

import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

const args = process.argv.slice(2);
const command = args[0];
const name = args[1];

const showHelp = () => {
  console.log(chalk.blueBright("📦 Available craft commands:\n"));
  const commandsDir = path.resolve(__dirname, "craft", "commands");
  const files = fs.readdirSync(commandsDir);

  files.forEach((file) => {
    const cmdName = file.replace(".ts", "").replace(/-/g, ":");
    console.log(chalk.green(` - ${cmdName}`));
  });

  console.log(`\nℹ️  Usage: npm run craft <command> <name>`);
};

if (!command || command === "--help" || command === "help") {
  showHelp();
  process.exit(0);
}

const commandFile = path.resolve(
  __dirname,
  "craft",
  "commands",
  `${command.replace(":", "-")}.ts`
);

if (!fs.existsSync(commandFile)) {
  console.log(chalk.red(`❌ Unknown command: ${command}`));
  showHelp();
  process.exit(1);
}

import(commandFile).then((mod) => {
  if (typeof mod.default === "function") {
    mod.default(name);
  } else {
    console.log(chalk.red("❌ Invalid command module."));
  }
});
