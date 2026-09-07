import "server-only";
import { SignJWT, jwtVerify } from "jose";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

const key = new TextEncoder().encode(process.env.JWT_SECRET);

/**
 * Resolves RP Name, RP ID, and Origin dynamically with fallback to env vars.
 * Supports localhost development, preview domains, and custom production domains.
 */
export function getRPConfig(req) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const protocol =
    req.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https");

  const rpName = process.env.RP_NAME || "Functional Bodybuilding";
  // Remove port for RP ID (e.g. "localhost:3000" -> "localhost")
  const rpID = process.env.RP_ID || host.split(":")[0];
  const origin = process.env.ORIGIN || `${protocol}://${host}`;

  return { rpName, rpID, origin };
}

/**
 * Sets an encrypted, short-lived HTTP-only cookie containing the challenge.
 */
export async function setChallengeCookie(cookieStore, challengeData) {
  const token = await new SignJWT(challengeData)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(key);

  cookieStore.set("webauthn_challenge", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 300, // 5 minutes
  });
}

/**
 * Retrieves the challenge from the cookie and clears it immediately to prevent replay.
 */
export async function getAndClearChallenge(cookieStore) {
  const token = cookieStore.get("webauthn_challenge")?.value;
  cookieStore.delete("webauthn_challenge");

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (err) {
    console.error("Failed to verify webauthn challenge token:", err);
    return null;
  }
}
