const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const ALGORITHM = "aes-256-gcm";

function encryptText(text, password, keyFile, context = null) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);

  const key = deriveKey(password, keyFile, salt, context);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const tag = cipher.getAuthTag();

  const version = context ? "v2" : "v1";

  return [
    version,
    salt.toString("hex"),
    iv.toString("hex"),
    tag.toString("hex"),
    encrypted
  ].join(":");
}

function decryptText(data, password, keyFile, context = null) {
  const parts = data.split(":");

  const version = parts[0];

  const salt = Buffer.from(parts[1], "hex");
  const iv = Buffer.from(parts[2], "hex");
  const tag = Buffer.from(parts[3], "hex");
  const encrypted = parts[4];

  const useContext = version === "v2";

  const key = deriveKey(
    password,
    keyFile,
    salt,
    useContext ? context : null
  );

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

function deriveKey(password, keyFile, salt, context = null) {
  const parts = [
    Buffer.from(password, "utf8"),
    keyFile
  ];

  if (context) {
    parts.push(Buffer.from(context, "utf8"));
  }

  return crypto.scryptSync(
    Buffer.concat(parts),
    salt,
    32
  );
}

function generateKeyFile() {
  return crypto.randomBytes(32);
}

function saveKeyToFile(filePath) {
  const dir = path.dirname(filePath);

  fs.mkdirSync(dir, { recursive: true });

  const key = crypto.randomBytes(32);

  fs.writeFileSync(filePath, key, { mode: 0o600 });

  return key;
}

module.exports = {
  encryptText,
  decryptText,
  saveKeyToFile
};