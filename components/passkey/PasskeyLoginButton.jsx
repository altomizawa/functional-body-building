'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Fingerprint, Loader2 } from 'lucide-react';
import {
  startAuthentication,
  browserSupportsWebAuthn,
  browserSupportsWebAuthnAutofill,
} from '@simplewebauthn/browser';

export default function PasskeyLoginButton() {
  const [isSupported, setIsSupported] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const supported = browserSupportsWebAuthn();
    setIsSupported(supported);

    if (supported) {
      // Setup WebAuthn Conditional UI (Autofill) if available
      browserSupportsWebAuthnAutofill().then((autofillSupported) => {
        if (!autofillSupported) return;

        fetch('/api/auth/passkey/auth-options')
          .then((res) => res.json())
          .then(async (options) => {
            if (options.error) return;

            try {
              const authResponse = await startAuthentication({
                optionsJSON: options,
                useBrowserAutofill: true,
              });

              setLoading(true);

              const verifyRes = await fetch('/api/auth/passkey/auth-verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(authResponse),
              });

              const result = await verifyRes.json();
              if (result.success) {
                router.push('/');
                router.refresh();
              }
            } catch (err) {
              // Ignore standard cancellation in autofill mode
              if (err?.name !== 'AbortError' && err?.name !== 'NotAllowedError') {
                console.error('Passkey autofill error:', err);
              }
            } finally {
              setLoading(false);
            }
          })
          .catch((err) => {
            console.error('Failed to fetch passkey options for autofill:', err);
          });
      });
    }
  }, [router]);

  const handlePasskeyLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      // 1. Fetch authentication options from server
      const optRes = await fetch('/api/auth/passkey/auth-options');
      const options = await optRes.json();

      if (!optRes.ok || options.error) {
        throw new Error(options.error || 'Failed to initialize passkey login.');
      }

      // 2. Prompt biometric / security key authentication on device
      const authResponse = await startAuthentication({ optionsJSON: options });

      // 3. Verify response with server
      const verifyRes = await fetch('/api/auth/passkey/auth-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authResponse),
      });

      const result = await verifyRes.json();
      if (!verifyRes.ok || !result.success) {
        throw new Error(result.error || 'Passkey verification failed.');
      }

      // 4. Redirect on success
      router.push('/');
      router.refresh();
    } catch (err) {
      if (err?.name === 'NotAllowedError') {
        // User cancelled the biometric prompt
        setError(null);
      } else {
        setError(err.message || 'Passkey sign-in failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="w-full space-y-2">
      <button
        type="button"
        onClick={handlePasskeyLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition duration-150 ease-in-out border border-neutral-700 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Verifying Passkey...</span>
          </>
        ) : (
          <>
            <Fingerprint className="w-5 h-5 text-neutral-300" />
            <span>Sign in with Passkey</span>
          </>
        )}
      </button>
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
    </div>
  );
}
