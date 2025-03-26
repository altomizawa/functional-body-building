import "server-only"

import { SignJWT, jwtVerify } from "jose"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

// Check if JWT_SECRET exists
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set")
}

const key = new TextEncoder().encode(process.env.JWT_SECRET)

const cookie = {
  name: "session",
  options: { httpOnly: true, secure: true, sameSite: "lax", path: "/" },
  duration: 24 * 60 * 60 * 1000,
}

export async function encrypt(payload) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("1d").sign(key)
}

export async function decrypt(session) {
  if (!session) return null

  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"], 
    })
    return payload
  } catch (error) {
    console.log("Failed to verify session:", error)
    return null
  }
}

export async function createSession(user) {
  try {
    const expires = new Date(Date.now() + cookie.duration)
    const session = await encrypt({user, expires: expires.toISOString() })
    const cookieStore = await cookies();
    cookieStore.set(cookie.name, session, { ...cookie.options, expires })
  } catch (error) {
    console.error('Failed to create session:', error);
    // You might want to throw a custom error or handle it differently
    throw new Error('Session creation failed: ' + (error.message || 'Unknown error'));
  }
}


export async function verifySession() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(cookie.name)?.value
  const session = await decrypt(sessionValue)

  if (!session) {
    console.log("Session not found")
    redirect("/login")
  }

  // Check if session has expired
  if (session.expires && new Date(session.expires) < new Date()) {
    cookies().delete(cookie.name)
    redirect("/login")
  }

  return session.user
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const session = cookieStore.delete(cookie.name)
  if (!session) {
    return false
  }
  return true
}

// Separate navigation functions for better reusability
export function redirectToHome() {
  redirect("/")
}

export function redirectToLogin() {
  redirect("/login")
}

