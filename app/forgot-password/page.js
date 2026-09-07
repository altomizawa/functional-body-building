"use client";
import Link from 'next/link';
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("If an account exists, a reset link has been sent to your email.");
    } else {
      setMessage(data.error || "Something went wrong.");
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <h2 className='title'>Forgot Password</h2>
      <form className='flex flex-col w-[320px] gap-4' onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Link href="/" className='button__back'>BACK</Link>
        <Button variant='primary' type="submit">Send Reset Link</Button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
