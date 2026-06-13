/**
 * Generate a bcrypt hash for the admin password.
 * Usage: npm run hash-password '<your-password>'
 * Paste the printed hash into ADMIN_PASSWORD_HASH in .env.local.
 */
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npm run hash-password '<your-password>'");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);

// Next.js loads env via dotenv-expand, which treats `$` as interpolation.
// A bcrypt hash is literally `$2b$...`, so each `$` MUST be escaped as `\$`
// in .env.local. Print the ready-to-paste, escaped line.
const escaped = hash.replace(/\$/g, "\\$");
console.log("\nPaste this into .env.local (dollar signs escaped for dotenv-expand):\n");
console.log(`ADMIN_PASSWORD_HASH="${escaped}"`);
console.log("\nRaw hash:", hash, "\n");
