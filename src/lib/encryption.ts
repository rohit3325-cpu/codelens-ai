import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET;

  if (!secret) {
    throw new Error("Missing ENCRYPTION_SECRET environment variable");
  }

  // SHA-256 always yields exactly 32 bytes, regardless of the secret's own
  // length, which is what aes-256-gcm requires for its key.
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts a plaintext string (e.g. a user's BYOK API key) into a single
 * "iv:authTag:ciphertext" hex string, safe to store in MongoDB. Never call
 * this from client code — it must only run on the server.
 */
export function encrypt(plainText: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Reverses `encrypt`. Throws if the payload was tampered with or the
 * encryption secret doesn't match the one used to encrypt it.
 */
export function decrypt(payload: string): string {
  const [ivHex, authTagHex, dataHex] = payload.split(":");

  if (!ivHex || !authTagHex || !dataHex) {
    throw new Error("Invalid encrypted payload");
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(ivHex, "hex")
  );

  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

/**
 * Produces a display-safe representation of an API key (e.g. "sk-a1••••f9k2")
 * for showing connection status in the UI without ever exposing the real key.
 */
export function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 8) {
    return "••••••••";
  }

  return `${apiKey.slice(0, 4)}••••${apiKey.slice(-4)}`;
}
