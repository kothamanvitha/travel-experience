"use client";

import { useState, useEffect } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

// Maps Firebase Auth error codes to user-friendly messages
function getFirebaseErrorMessage(code) {
  switch (code) {
    case "auth/invalid-phone-number":
      return "Invalid phone number. Include country code (e.g. +91 98765 43210).";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "auth/operation-not-allowed":
      return "Phone sign-in is not enabled. Please contact support or use the demo login below.";
    case "auth/quota-exceeded":
      return "SMS quota exceeded. Please try again later.";
    case "auth/captcha-check-failed":
      return "reCAPTCHA verification failed. Please refresh the page and try again.";
    case "auth/missing-phone-number":
      return "Please enter a phone number.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return "Failed to send verification code. Check your number format (e.g. +91 98765 43210).";
  }
}

// Clears and re-creates the reCAPTCHA verifier (required after each failed attempt)
function resetRecaptcha() {
  try {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
  } catch (err) {
    console.error("Error resetting recaptcha:", err);
  }
}

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Initialize reCAPTCHA only in browser context
    if (typeof window !== "undefined" && auth && !window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
      } catch (err) {
        console.error("Error initializing recaptcha:", err);
      }
    }
    // Cleanup on unmount
    return () => {
      if (typeof window !== "undefined" && window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (_) {}
      }
    };
  }, []);

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setLoading(true);
    setError("");

    try {
      const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`;

      // Ensure verifier exists (may have been cleared after a prior failure)
      if (!window.recaptchaVerifier) {
        resetRecaptcha();
      }

      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
    } catch (err) {
      console.error("signInWithPhoneNumber error:", err);
      // Firebase requires a fresh RecaptchaVerifier after any failure
      resetRecaptcha();
      setError(getFirebaseErrorMessage(err?.code));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode || !confirmationResult) return;
    setLoading(true);
    setError("");

    try {
      await confirmationResult.confirm(verificationCode);
      router.push("/planner");
    } catch (err) {
      console.error("confirm error:", err);
      const msg =
        err?.code === "auth/invalid-verification-code"
          ? "Incorrect code. Please check the SMS and try again."
          : err?.code === "auth/code-expired"
          ? "Code has expired. Please request a new one."
          : "Verification failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const skipLogin = () => {
    // For demo / hackathon purposes when Firebase Phone Auth isn't configured
    router.push("/planner");
  };

  return (
    <main className="auth-wrapper">
      <div className="auth-card glass-panel animate-fade-in">
        <h1 className="heading-2 text-center">
          <span className="logo">ExperienceYourTravel</span>
        </h1>
        <p className="text-center text-muted mb-8">
          Plan your perfect trip with AI. Sign in to continue.
        </p>

        {error && <div style={{ color: "var(--error)", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}

        {!confirmationResult ? (
          <form onSubmit={handleSendCode}>
            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                className="input-field"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Sending..." : "Send Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <div className="input-group">
              <label htmlFor="code">Verification Code</label>
              <input
                id="code"
                type="text"
                placeholder="123456"
                className="input-field"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        )}

        <div id="recaptcha-container"></div>
        
        <div className="text-center mt-4">
          <button onClick={skipLogin} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", textDecoration: "underline" }}>
            Skip for Hackathon Demo
          </button>
        </div>
      </div>
    </main>
  );
}
