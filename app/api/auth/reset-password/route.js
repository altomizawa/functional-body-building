import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDB from '@/lib/database/db';
import User from '@/models/User';

export async function POST(req) {
  try {
    await connectDB();
    const { token, password } = await req.json();
    if (!token || !password) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    // Find the user with the matching reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gte: new Date() }, // Ensure token is still valid
    });

    if (!user) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password & clear reset token
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    return NextResponse.json({ message: "Password reset successful" }, { status: 200 });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
