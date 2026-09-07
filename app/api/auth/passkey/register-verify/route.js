import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import connectDB from "@/lib/database/db";
import User from "@/models/User";
import { verifySessionForRequests } from "@/lib/session";
import { getRPConfig, getAndClearChallenge } from "@/lib/webauthn";

export async function POST(request) {
  try {
    const session = await verifySessionForRequests();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be signed in to register a passkey." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    const storedChallenge = await getAndClearChallenge(cookieStore);
    if (!storedChallenge || storedChallenge.type !== "registration") {
      return NextResponse.json(
        { error: "Registration session expired. Please try again." },
        { status: 400 }
      );
    }

    if (storedChallenge.userId !== session.user.id) {
      return NextResponse.json(
        { error: "User mismatch in registration challenge." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { rpID, origin } = getRPConfig(request);

    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: storedChallenge.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json(
        { error: "Failed to verify passkey registration." },
        { status: 400 }
      );
    }

    const { credential, credentialDeviceType, credentialBackedUp } =
      verification.registrationInfo;

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Check if credentialID already exists for this user
    const existing = (user.passkeys || []).find(
      (p) => p.credentialID === credential.id
    );
    if (!existing) {
      user.passkeys.push({
        credentialID: credential.id,
        credentialPublicKey: Buffer.from(credential.publicKey).toString("base64"),
        counter: credential.counter,
        credentialDeviceType,
        credentialBackedUp,
        transports: body.response?.transports || credential.transports || [],
        name: body.deviceName || "Passkey",
        createdAt: new Date(),
        lastUsedAt: new Date(),
      });
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: "Passkey registered successfully!",
    });
  } catch (error) {
    console.error("Error verifying passkey registration:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify passkey registration" },
      { status: 500 }
    );
  }
}
