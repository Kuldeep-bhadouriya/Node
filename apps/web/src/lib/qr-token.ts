import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { env } from "@node/env/server";

export interface QRToken {
  id: string;
  token: string;
}

/**
 * Generate a signed token for a student ID
 * Tokens never expire. Format: {randomHex}:{timestamp}:{hmacSignature}
 */
export function generateQRToken(studentId: string): QRToken {
  const random = randomBytes(16).toString("hex");
  const timestamp = Date.now();

  const signature = createHmac("sha256", env.QR_TOKEN_SECRET)
    .update(`${studentId}:${random}:${timestamp}`)
    .digest("hex");

  return {
    id: studentId,
    token: `${random}:${timestamp}:${signature}`,
  };
}

/**
 * Verify a token for a student ID
 * Tokens are permanent and never expire; validity is checked via signature only.
 */
export function verifyQRToken(studentId: string, token: string): boolean {
  const parts = token.split(":");
  if (parts.length !== 3) return false;

  const [random, timestampStr, signature] = parts;
  const timestamp = Number.parseInt(timestampStr, 10);

  if (Number.isNaN(timestamp)) return false;

  // Verify signature
  const expectedSignature = createHmac("sha256", env.QR_TOKEN_SECRET)
    .update(`${studentId}:${random}:${timestamp}`)
    .digest("hex");

  const a = Buffer.from(signature, "hex");
  const b = Buffer.from(expectedSignature, "hex");
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}
