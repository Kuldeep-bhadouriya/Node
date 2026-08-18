import { createHmac, randomBytes } from "crypto";
import { env } from "@node/env/server";

const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface QRToken {
  id: string;
  token: string;
  expiresAt: number;
}

/**
 * Generate a signed token for a student ID
 * Token format: {randomHex}:{timestamp}:{hmacSignature}
 */
export function generateQRToken(studentId: string): QRToken {
  const random = randomBytes(16).toString("hex");
  const timestamp = Date.now();
  const expiresAt = timestamp + TOKEN_EXPIRY_MS;
  
  const signature = createHmac("sha256", env.QR_TOKEN_SECRET)
    .update(`${studentId}:${random}:${timestamp}`)
    .digest("hex");
  
  return {
    id: studentId,
    token: `${random}:${timestamp}:${signature}`,
    expiresAt,
  };
}

/**
 * Verify a token for a student ID
 * Returns true if the token is valid and not expired
 */
export function verifyQRToken(studentId: string, token: string): boolean {
  const parts = token.split(":");
  if (parts.length !== 3) return false;
  
  const [random, timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  
  if (isNaN(timestamp)) return false;
  
  // Check expiration
  if (Date.now() > timestamp + TOKEN_EXPIRY_MS) return false;
  
  // Verify signature
  const expectedSignature = createHmac("sha256", env.QR_TOKEN_SECRET)
    .update(`${studentId}:${random}:${timestamp}`)
    .digest("hex");
  
  return signature === expectedSignature;
}
