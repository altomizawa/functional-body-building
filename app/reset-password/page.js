"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const ResetPasswordContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Password reset successful. Redirecting...");
      setTimeout(() => router.push("/login"), 3000);
    } else {
      setMessage(data.error || "Something went wrong.");
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <h2>Reset Password</h2>
      <form className='flex flex-col w-[320px] gap-4' onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className='px-4 py-2 border-[1px] border-black rounded-lg hover:bg-white' type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
