import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import connectDB from "@/lib/database/db";
import User from "@/models/User";
import { verifySessionForRequests } from "@/lib/session";
import { getRPConfig, setChallengeCookie } from "@/lib/webauthn";

export async function POST(request) {
  try {
    const session = await verifySessionForRequests();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be signed in to register a passkey." },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const { rpName, rpID } = getRPConfig(request);

    // Exclude credentials already registered to this user
    const excludeCredentials = (user.passkeys || []).map((passkey) => ({
      id: passkey.credentialID,
      transports: passkey.transports,
    }));

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: new TextEncoder().encode(user._id.toString()),
      userName: user.email,
      userDisplayName: user.name || user.email,
      attestationType: "none",
      excludeCredentials,
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
      },
    });

    const cookieStore = await cookies();
    await setChallengeCookie(cookieStore, {
      challenge: options.challenge,
      userId: user._id.toString(),
      type: "registration",
    });

    return NextResponse.json(options);
  } catch (error) {
    console.error("Error generating registration options:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate registration options" },
      { status: 500 }
    );
  }
}
