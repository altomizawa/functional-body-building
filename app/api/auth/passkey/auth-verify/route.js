import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import connectDB from "@/lib/database/db";
import User from "@/models/User";
import { createSession } from "@/lib/session";
import { getRPConfig, getAndClearChallenge } from "@/lib/webauthn";

export async function POST(request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();

    const storedChallenge = await getAndClearChallenge(cookieStore);
    if (!storedChallenge || storedChallenge.type !== "authentication") {
      return NextResponse.json(
        { error: "Authentication session expired or invalid. Please try again." },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the user that owns this credentialID
    const credentialID = body.id;
    const user = await User.findOne({ "passkeys.credentialID": credentialID });
    if (!user) {
      return NextResponse.json(
        { error: "Passkey not recognized. Please sign in with your email/password." },
        { status: 404 }
      );
    }

    const passkey = user.passkeys.find((p) => p.credentialID === credentialID);
    if (!passkey) {
      return NextResponse.json(
        { error: "Passkey not found for user." },
        { status: 404 }
      );
    }

    const { rpID, origin } = getRPConfig(request);

    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge: storedChallenge.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: passkey.credentialID,
        publicKey: Buffer.from(passkey.credentialPublicKey, "base64"),
        counter: passkey.counter,
        transports: passkey.transports,
      },
      requireUserVerification: false,
    });

    if (!verification.verified) {
      return NextResponse.json(
        { error: "Passkey verification failed." },
        { status: 400 }
      );
    }

    // Update counter and lastUsedAt
    passkey.counter = verification.authenticationInfo.newCounter;
    passkey.lastUsedAt = new Date();
    await user.save();

    // Create session
    const sanitizedUser = {
      id: user.id || user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
    await createSession(sanitizedUser);

    return NextResponse.json({
      success: true,
      user: sanitizedUser,
    });
  } catch (error) {
    console.error("Error verifying passkey authentication:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify passkey" },
      { status: 500 }
    );
  }
}
