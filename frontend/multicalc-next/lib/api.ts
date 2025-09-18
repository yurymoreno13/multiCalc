// frontend/multicalc-next/lib/api.ts
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";


export type ConvertRequest = {
category: "length" | "weight" | "temperature";
from: string; // p.ej. "m", "kg", "C"
to: string; // p.ej. "cm", "lb", "F"
value: number;
};


export async function convert(req: ConvertRequest) {
const res = await fetch(`${API_BASE}/api/convert`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(req),
cache: "no-store",
});
if (!res.ok) {
const txt = await res.text();
throw new Error(`Error ${res.status}: ${txt}`);
}
return res.json() as Promise<{ result: number; meta?: unknown }>;
}