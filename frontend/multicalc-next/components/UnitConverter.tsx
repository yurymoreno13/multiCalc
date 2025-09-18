// components/UnitConverter.tsx
"use client";
import { useMemo, useState } from "react";

type Category = "time" | "weight" | "temperature" | "currency";

const OPTIONS: Record<Category, { label: string; units: { value: string; label: string }[] }> = {
  time: {
    label: "Tiempo",
    units: [
      { value: "h", label: "Horas (h)" },
      { value: "d", label: "Días (d)" },
      { value: "mo", label: "Meses (mo)" },
      { value: "y", label: "Años (y)" },
    ],
  },
  weight: {
    label: "Peso",
    units: [
      { value: "kg", label: "Kilogramos (kg)" },
      { value: "g", label: "Gramos (g)" },
      { value: "lb", label: "Libras (lb)" },
    ],
  },
  temperature: {
    label: "Temperatura",
    units: [
      { value: "C", label: "Celsius (°C)" },
      { value: "F", label: "Fahrenheit (°F)" },
      { value: "K", label: "Kelvin (K)" },
    ],
  },
  currency: {
    label: "Moneda",
    units: [
      { value: "USD", label: "Dólar (USD)" },
      { value: "COP", label: "Peso colombiano (COP)" },
      { value: "EUR", label: "Euro (EUR)" },
    ],
  },
};

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("time");
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState("h");
  const [to, setTo] = useState("d");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ajustar unidades por categoría
  const unitOptions = useMemo(() => OPTIONS[category].units, [category]);

  function resetUnitsFor(cat: Category) {
    const [u1, u2] = OPTIONS[cat].units;
    setFrom(u1.value);
    setTo(u2.value);
  }

  async function handleConvert(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, from, to, value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Error ${res.status}`);
      setResult(data.result);
    } catch (err: unknown) {
      if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Error desconocido");
  }
} finally {
  setLoading(false);
}

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-2xl font-semibold tracking-tight">Conversor de Unidades</h2>
          <p className="text-sm text-gray-500">Tiempo, peso, temperatura y moneda.</p>
        </div>

        <form onSubmit={handleConvert} className="grid gap-4 p-6 sm:grid-cols-2">
          {/* Categoría */}
          <label className="text-sm font-medium text-gray-700">
            Categoría
            <select
              value={category}
              onChange={(e) => {
                const c = e.target.value as Category;
                setCategory(c);
                resetUnitsFor(c);
                setResult(null);
              }}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="time">{OPTIONS.time.label}</option>
              <option value="weight">{OPTIONS.weight.label}</option>
              <option value="temperature">{OPTIONS.temperature.label}</option>
              <option value="currency">{OPTIONS.currency.label}</option>
            </select>
          </label>

          {/* Valor */}
          <label className="text-sm font-medium text-gray-700">
            Valor
            <input
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {/* De */}
          <label className="text-sm font-medium text-gray-700">
            De
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {unitOptions.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </label>

          {/* A */}
          <label className="text-sm font-medium text-gray-700">
            A
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {unitOptions.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </label>

          <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-5 py-2 text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Convirtiendo..." : "Convertir"}
            </button>
            <button
              type="button"
              onClick={() => setResult(null)}
              className="rounded-xl border px-5 py-2 transition hover:bg-gray-50"
            >
              Limpiar
            </button>
            {error && <span className="text-red-600">{error}</span>}
          </div>

          {result !== null && (
            <div className="sm:col-span-2 rounded-xl bg-gray-50 p-4">
              <p className="text-lg">
                <span className="font-semibold">Resultado:</span> {result}
              </p>
            </div>
          )}
        </form>

        <div className="border-t px-6 py-3 text-xs text-gray-500">
          Hecho con Next.js & Tailwind
        </div>
      </div>
    </div>
  );
}
