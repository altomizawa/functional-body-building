'use client';

import { useState, useEffect } from 'react';
import { Fingerprint, X, Loader2, CheckCircle2 } from 'lucide-react';
import {
  startRegistration,
  browserSupportsWebAuthn,
} from '@simplewebauthn/browser';

export default function PasskeyRegisterPrompt({ user }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only prompt logged-in users whose devices support WebAuthn
    if (!user || !user.id) return;

    if (!browserSupportsWebAuthn()) return;

    const dismissedKey = `passkey_prompt_dismissed_${user.id}`;
    const alreadyDismissed = localStorage.getItem(dismissedKey);
    if (alreadyDismissed) return;

    // Small delay so it appears smoothly without jarring page load
    const timer = setTimeout(() => {
      setVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [user]);

  const handleDismiss = () => {
    if (user?.id) {
      localStorage.setItem(`passkey_prompt_dismissed_${user.id}`, 'true');
    }
    setVisible(false);
  };

  const handleRegisterPasskey = async () => {
    setError(null);
    setLoading(true);

    try {
      // 1. Get registration options
      const optRes = await fetch('/api/auth/passkey/register-options', {
        method: 'POST',
      });
      const options = await optRes.json();

      if (!optRes.ok || options.error) {
        throw new Error(options.error || 'Failed to initialize passkey registration.');
      }

      // 2. Trigger browser registration ceremony
      const registrationResponse = await startRegistration({ optionsJSON: options });

      // 3. Send response to verify and save
      const verifyRes = await fetch('/api/auth/passkey/register-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...registrationResponse,
          deviceName: navigator.userAgent.includes('iPhone')
            ? 'iPhone'
            : navigator.userAgent.includes('iPad')
            ? 'iPad'
            : navigator.userAgent.includes('Macintosh')
            ? 'Mac'
            : navigator.userAgent.includes('Windows')
            ? 'Windows PC'
            : navigator.userAgent.includes('Android')
            ? 'Android'
            : 'Passkey',
        }),
      });

      const result = await verifyRes.json();
      if (!verifyRes.ok || !result.success) {
        throw new Error(result.error || 'Failed to verify passkey registration.');
      }

      // Success
      setSuccess(true);
      if (user?.id) {
        localStorage.setItem(`passkey_prompt_dismissed_${user.id}`, 'true');
      }

      setTimeout(() => {
        setVisible(false);
      }, 3000);
    } catch (err) {
      if (err?.name === 'NotAllowedError') {
        // User cancelled the prompt
        setError(null);
      } else {
        setError(err.message || 'Could not register passkey on this device.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-neutral-900 border border-neutral-700 rounded-xl p-4 shadow-2xl text-white transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-3">
        <div className="p-2 bg-neutral-800 rounded-lg shrink-0">
          <Fingerprint className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm">Enable Passkey</h4>
          <p className="text-xs text-neutral-400 mt-1">
            Sign in instantly next time using Touch ID, Face ID, or Windows Hello.
          </p>

          {success ? (
            <div className="flex items-center gap-2 mt-3 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Passkey registered on this device!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={handleRegisterPasskey}
                disabled={loading}
                className="px-3 py-1.5 bg-white text-black text-xs font-semibold rounded-md hover:bg-neutral-200 transition-colors disabled:opacity-60 flex items-center gap-1.5 cursor-pointer"
              >
                {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                <span>{loading ? 'Registering...' : 'Enable Passkey'}</span>
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                disabled={loading}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Not now
              </button>
            </div>
          )}

          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-neutral-400 hover:text-white transition-colors p-1"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
