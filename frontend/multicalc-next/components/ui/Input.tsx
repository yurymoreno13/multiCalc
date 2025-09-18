// frontend/multicalc-next/components/ui/Input.tsx
"use client";
import { InputHTMLAttributes } from "react";


type Props = InputHTMLAttributes<HTMLInputElement> & {
label?: string;
error?: string;
};


export function Input({ label, error, className = "", ...rest }: Props) {
return (
<label className="block">
{label && <span className="mb-1 block text-sm text-gray-700">{label}</span>}
<input
className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
error ? "border-red-400" : "border-gray-300"
} ${className}`}
{...rest}
/>
{error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
</label>
);
}