"use client";

import { useEffect, useRef } from "react";

export default function OtpInput({ value = "", onChange, onComplete, disabled = false, autoFocus = true }) {
  const inputsRef = useRef([]);
  const digits = Array.from({ length: 6 }, (_, index) => value[index] || "");

  useEffect(() => {
    if (!autoFocus || disabled) return undefined;

    const frame = requestAnimationFrame(() => {
      const firstInput = inputsRef.current[0];
      firstInput?.focus();
      firstInput?.select();
    });

    return () => cancelAnimationFrame(frame);
  }, [autoFocus, disabled]);

  const updateValue = (nextDigits) => {
    const nextValue = nextDigits.join("").replace(/\D/g, "").slice(0, 6);
    onChange(nextValue);
    if (nextValue.length === 6 && onComplete) {
      setTimeout(() => onComplete(nextValue), 0);
    }
  };

  const handleChange = (index, event) => {
    const nextDigits = [...digits];
    const nextValue = event.target.value.replace(/\D/g, "");
    if (!nextValue) {
      nextDigits[index] = "";
      updateValue(nextDigits);
      return;
    }
    nextDigits[index] = nextValue.slice(-1);
    updateValue(nextDigits);
    if (index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    if (pasted.length === 6 && onComplete) {
      setTimeout(() => onComplete(pasted), 0);
    }
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  };

  return <div className="flex items-center justify-center gap-2 sm:gap-3" role="group" aria-label="Six digit verification code">{digits.map((digit, index) => <input key={index} ref={(element) => { inputsRef.current[index] = element; }} value={digit} onChange={(event) => handleChange(index, event)} onKeyDown={(event) => handleKeyDown(index, event)} onPaste={handlePaste} disabled={disabled} autoComplete={index === 0 ? "one-time-code" : "off"} inputMode="numeric" maxLength={1} aria-label={`Verification digit ${index + 1}`} className="size-11 rounded-lg border-2 border-divider bg-primary-card text-center font-heading text-2xl font-semibold text-primary-text shadow-sm outline-none transition-all placeholder:text-primary-muted hover:border-primary-action/50 focus:border-primary-action focus:ring-4 focus:ring-primary-action/15 sm:size-12" />)}</div>;
}
