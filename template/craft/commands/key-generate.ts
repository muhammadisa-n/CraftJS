import * as fs from "fs";
import * as path from "path";
import crypto from "crypto";
import chalk from "chalk";

export default function keyGenerate() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    console.error(chalk.red("❌ .env file not found!"));
    process.exit(1);
  }

  let envContent = fs.readFileSync(envPath, "utf-8");

  const generateKey = () => crypto.randomBytes(16).toString("hex");

  const accessTokenKey = generateKey();
  const refreshTokenKey = generateKey();

  if (envContent.includes("JWT_SECRET_ACCESS_TOKEN=")) {
    envContent = envContent.replace(
      /JWT_SECRET_ACCESS_TOKEN=.*/g,
      `JWT_SECRET_ACCESS_TOKEN=${accessTokenKey}`
    );
  } else {
    envContent += `\nJWT_SECRET_ACCESS_TOKEN=${accessTokenKey}`;
  }

  if (envContent.includes("JWT_SECRET_REFRESH_TOKEN=")) {
    envContent = envContent.replace(
      /JWT_SECRET_REFRESH_TOKEN=.*/g,
      `JWT_SECRET_REFRESH_TOKEN=${refreshTokenKey}`
    );
  } else {
    envContent += `\nJWT_SECRET_REFRESH_TOKEN=${refreshTokenKey}`;
  }

  fs.writeFileSync(envPath, envContent);

  console.log(
    chalk.green(
      "✅ JWT access and refresh token secrets generated successfully."
    )
  );
}
