import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env: ${name}. Check your .env file for ${name}`);
  }
  return value;
}

function numberEnv(name: string, fallback: number) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const num = Number(raw);
  return Number.isFinite(num) ? num : fallback;
}

export const env = {
  token: requireEnv("DISCORD_TOKEN"),
  introChannelId: requireEnv("INTRO_CHANNEL_ID"),
  memberRoleId: requireEnv("MEMBER_ROLE_ID"),
  logChannelId: requireEnv("LOG_CHANNEL_ID"),
  minChars: numberEnv("MIN_CHARS", 20),
  cooldownMs: numberEnv("COOLDOWN_MS", 10_000),
};
