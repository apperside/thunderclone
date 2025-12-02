import { app } from "electron";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import logger from "./logger";

const TOKEN_FILE = "auth-token.json";
const TOKEN_LENGTH = 32; // 32 bytes = 256 bits of entropy

interface TokenData {
  token: string;
  createdAt: string;
}

function getTokenFilePath(): string {
  return path.join(app.getPath("userData"), TOKEN_FILE);
}

function generateToken(): string {
  return crypto.randomBytes(TOKEN_LENGTH).toString("hex");
}

function saveToken(token: string): void {
  const tokenData: TokenData = {
    token,
    createdAt: new Date().toISOString(),
  };
  const filePath = getTokenFilePath();
  fs.writeFileSync(filePath, JSON.stringify(tokenData, null, 2), "utf-8");
  logger.info(`Token saved to ${filePath}`);
}

function loadToken(): string | null {
  const filePath = getTokenFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const tokenData: TokenData = JSON.parse(data);
      logger.info("Token loaded from storage");
      return tokenData.token;
    }
  } catch (error) {
    logger.error("Error loading token:", error);
  }
  return null;
}

function getOrCreateToken(): string {
  let token = loadToken();
  if (!token) {
    token = generateToken();
    saveToken(token);
    logger.info("New token generated");
  }
  return token;
}

function regenerateToken(): string {
  const token = generateToken();
  saveToken(token);
  logger.info("Token regenerated");
  return token;
}

function verifyToken(providedToken: string, storedToken: string): boolean {
  // Use timing-safe comparison to prevent timing attacks
  if (providedToken.length !== storedToken.length) {
    return false;
  }
  return crypto.timingSafeEqual(
    Buffer.from(providedToken),
    Buffer.from(storedToken)
  );
}

const tokenStorage = {
  getOrCreateToken,
  regenerateToken,
  verifyToken,
  loadToken,
};

export default tokenStorage;
