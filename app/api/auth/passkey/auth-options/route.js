import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { getRPConfig, setChallengeCookie } from "@/lib/webauthn";

export async function GET(request) {
  try {
    const { rpID } = getRPConfig(request);

    // Discoverable passkey login (resident key): allowCredentials is empty array
    // userVerification: 'preferred' prompts for biometric verification
    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: "preferred",
      allowCredentials: [],
    });

    const cookieStore = await cookies();
    await setChallengeCookie(cookieStore, {
      challenge: options.challenge,
      type: "authentication",
    });

    return NextResponse.json(options);
  } catch (error) {
    console.error("Error generating passkey auth options:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate authentication options" },
      { status: 500 }
    );
  }
}
