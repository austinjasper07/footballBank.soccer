"use client";

import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import { ChevronDown, Phone } from "lucide-react";
import { countries } from "@/data/countries&code";

const countryNames = new Map(countries.map((country) => [country.code, country.name]));
const phoneCountries = getCountries()
  .map((code) => ({ code, name: countryNames.get(code) || code, dialCode: `+${getCountryCallingCode(code)}` }))
  .sort((first, second) => first.name.localeCompare(second.name));

export function PhoneField({ countryCode, phone, onCountryCodeChange, onPhoneChange, id = "phone", required = true }) {
  const selected = phoneCountries.find((country) => country.code === countryCode) || phoneCountries.find((country) => country.code === "US");

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">Phone number{required ? " *" : ""}</label>
      <div className="flex overflow-hidden rounded-md border border-divider bg-primary-card shadow-sm transition-all focus-within:border-primary-action focus-within:ring-2 focus-within:ring-primary-action/20">
        <label className="relative flex min-w-29 items-center gap-2 border-r border-divider bg-primary-surface px-3 text-sm font-semibold text-primary-text">
          <span className="text-primary-action">{selected?.dialCode}</span>
          <ChevronDown className="size-4 text-primary-muted" aria-hidden="true" />
          <select
            aria-label="Phone country calling code"
            value={selected?.code || "US"}
            onChange={(event) => onCountryCodeChange(event.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          >
            {phoneCountries.map((country) => (
              <option key={country.code} value={country.code}>{country.name} ({country.dialCode})</option>
            ))}
          </select>
        </label>
        <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
          <Phone className="size-4 shrink-0 text-primary-muted" aria-hidden="true" />
          <input
            id={id}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            required={required}
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            placeholder="555 123 4567"
            className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-primary-muted"
          />
        </div>
      </div>
      <p className="text-xs text-primary-muted">Your number is stored with the {selected?.dialCode || "+1"} calling code.</p>
    </div>
  );
}
