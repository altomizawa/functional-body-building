import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { sendResetEmail } from "@/utils/mailer"; // Utility function for sending emails
import User from '@/models/User';
import connectDB from '@/lib/database/db';

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();
    
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    // Check if the email exists in the database
    const user = await User.findOne({ email: email });
    if (!user) return NextResponse.json({ message: "Reset email sent if account exists" }, { status: 200 });

    // Generate a secure random token
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    // Save the token in the database
    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();

    // Send reset email
    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
    await sendResetEmail(email, resetLink, 'reset', _);

    return NextResponse.json({ message: "Check your email for the reset link" }, { status: 200 });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
