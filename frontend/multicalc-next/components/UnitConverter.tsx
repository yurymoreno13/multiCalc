// components/UnitConverter.tsx
"use client";

import { useState } from "react";

type Category = "time" | "weight" | "temperature" | "currency";

type TimeUnit = "h" | "d" | "mo" | "y";
type WeightUnit = "kg" | "g" | "lb";
type TempUnit = "C" | "F" | "K";
type CurrencyUnit = "USD" | "COP" | "EUR";

type Unit = TimeUnit | WeightUnit | TempUnit | CurrencyUnit;

const optionsByCategory: Record<Category, { label: string; value: Unit }[]> = {
  time: [
    { label: "Horas (h)", value: "h" },
    { label: "Días (d)", value: "d" },
    { label: "Meses (mo)", value: "mo" },
    { label: "Años (y)", value: "y" },
  ],
  weight: [
    { label: "Kilogramos (kg)", value: "kg" },
    { label: "Gramos (g)", value: "g" },
    { label: "Libras (lb)", value: "lb" },
  ],
  temperature: [
    { label: "Celsius (°C)", value: "C" },
    { label: "Fahrenheit (°F)", value: "F" },
    { label: "Kelvin (K)", value: "K" },
  ],
  currency: [
    { label: "Dólar (USD)", value: "USD" },
    { label: "Peso Col. (COP)", value: "COP" },
    { label: "Euro (EUR)", value: "EUR" },
  ],
};

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("time");
  const [from, setFrom] = useState<Unit>("h");
  const [to, setTo] = useState<Unit>("y");
  const [value, setValue] = useState<number>(1);
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetUnitsFor(cat: Category) {
    if (cat === "time") {
      setFrom("h");
      setTo("d");
    } else if (cat === "weight") {
      setFrom("kg");
      setTo("g");
    } else if (cat === "temperature") {
      setFrom("C");
      setTo("F");
    } else {
      setFrom("USD");
      setTo("COP");
    }
  }

  async function handleConvert(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, from, to, value }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Error ${res.status}`);
      }

      const data: { result: number } = await res.json();
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
  }

  const units = optionsByCategory[category];

  return (
    <div className="p-6 border rounded-lg bg-white shadow">
      <h2 className="text-xl font-semibold mb-2">Conversor de Unidades</h2>
      <p className="text-sm text-gray-600 mb-4">
        Tiempo, peso, temperatura y moneda.
      </p>

      <form onSubmit={handleConvert} className="grid gap-3 sm:grid-cols-2">
        {/* Categoría */}
        <label className="text-sm text-gray-700">
          Categoría
          <select
            value={category}
            onChange={(e) => {
              const cat = e.target.value as Category;
              setCategory(cat);
              resetUnitsFor(cat);
              setResult(null);
              setError(null);
            }}
            className="mt-1 w-full rounded border px-2 py-1"
          >
            <option value="time">Tiempo</option>
            <option value="weight">Peso</option>
            <option value="temperature">Temperatura</option>
            <option value="currency">Moneda</option>
          </select>
        </label>

        {/* Valor */}
        <label className="text-sm text-gray-700">
          Valor
          <input
            type="number"
            step="any"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="mt-1 w-full rounded border px-2 py-1"
            required
          />
        </label>

        {/* De */}
        <label className="text-sm text-gray-700">
          De
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value as Unit)}
            className="mt-1 w-full rounded border px-2 py-1"
          >
            {units.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </label>

        {/* A */}
        <label className="text-sm text-gray-700">
          A
          <select
            value={to}
            onChange={(e) => setTo(e.target.value as Unit)}
            className="mt-1 w-full rounded border px-2 py-1"
          >
            {units.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </label>

        <div className="sm:col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          >
            {loading ? "Convirtiendo..." : "Convertir"}
          </button>
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setError(null);
            }}
            className="px-4 py-2 rounded border"
          >
            Limpiar
          </button>
        </div>
      </form>

      {error && <p className="text-red-600 mt-3">{error}</p>}
      {result !== null && (
        <p className="mt-3 text-lg">
          <strong>Resultado:</strong> {result}
        </p>
      )}
    </div>
  );
}
