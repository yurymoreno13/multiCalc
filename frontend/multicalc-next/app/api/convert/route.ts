import { NextResponse } from "next/server";

type Category = "time" | "weight" | "temperature" | "currency";

const round = (n: number, d = 6) => {
  if (!Number.isFinite(n)) throw new Error("Resultado no numérico");
  return Number(n.toFixed(d));
};

// ========== Tiempo ==========
function convertTime(from: string, to: string, value: number) {
  const factors: Record<string, number> = {
    h: 3600,                  // horas
    d: 3600 * 24,             // días
    mo: 3600 * 24 * 30.44,    // meses promedio
    y: 3600 * 24 * 365.25,    // años promedio
  };
  const f = factors[from];
  const t = factors[to];
  if (!Number.isFinite(f) || !Number.isFinite(t)) {
    throw new Error("Unidad de tiempo inválida");
  }
  return round((value * f) / t, 6);
}

// ========== Peso ==========
function convertWeight(from: string, to: string, value: number) {
  const map: Record<string, number> = {
    kg: 1,
    g: 0.001,
    lb: 0.45359237,
  };
  if (!(from in map) || !(to in map)) {
    throw new Error("Unidad de peso inválida");
  }
  const kg = value * map[from];
  return round(kg / map[to], 6);
}

// ========== Temperatura ==========
function convertTemperature(from: string, to: string, value: number) {
  let kelvin: number;
  if (from === "K") kelvin = value;
  else if (from === "C") kelvin = value + 273.15;
  else if (from === "F") kelvin = (value - 32) * (5 / 9) + 273.15;
  else throw new Error("Unidad de temperatura inválida");

  let out: number;
  if (to === "K") out = kelvin;
  else if (to === "C") out = kelvin - 273.15;
  else if (to === "F") out = (kelvin - 273.15) * (9 / 5) + 32;
  else throw new Error("Unidad de temperatura inválida");

  return round(out, 4);
}

// ========== Moneda ==========
async function convertCurrency(from: string, to: string, value: number) {
  const FROM = String(from).toUpperCase();
  const TO = String(to).toUpperCase();
  if (FROM === TO) return round(value, 4);

  // 1) /convert
  try {
    const res = await fetch(
      `https://api.exchangerate.host/convert?from=${FROM}&to=${TO}&amount=${value}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      if (typeof data?.result === "number") return round(data.result, 4);
    }
  } catch (_) {}

  // 2) /latest
  try {
    const res2 = await fetch(
      `https://api.exchangerate.host/latest?base=${FROM}&symbols=${TO}`,
      { cache: "no-store" }
    );
    if (res2.ok) {
      const data2 = await res2.json();
      const rate = data2?.rates?.[TO];
      if (typeof rate === "number") return round(value * rate, 4);
    }
  } catch (_) {}

  // 3) open.er-api.com
  try {
    const res3 = await fetch(`https://open.er-api.com/v6/latest/${FROM}`, {
      cache: "no-store",
    });
    if (res3.ok) {
      const data3 = await res3.json();
      const rate = data3?.rates?.[TO];
      if (typeof rate === "number") return round(value * rate, 4);
    }
  } catch (_) {}

  throw new Error("Tasa de cambio inválida");
}

// ========== Handler principal ==========
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const category = body.category as Category;
    const from = String(body.from ?? "").trim();
    const to = String(body.to ?? "").trim();
    const value = Number(body.value);

    if (!Number.isFinite(value)) {
      return NextResponse.json({ error: "Valor inválido" }, { status: 400 });
    }

    let result: number;

    if (category === "time") {
      result = convertTime(from, to, value);
    } else if (category === "weight") {
      result = convertWeight(from, to, value);
    } else if (category === "temperature") {
      result = convertTemperature(from, to, value);
    } else if (category === "currency") {
      result = await convertCurrency(from, to, value);
    } else {
      return NextResponse.json({ error: "Categoría no soportada" }, { status: 400 });
    }

    return NextResponse.json({ result });
  } catch (err: any) {
    const msg = String(err?.message || "Error");
    const status = /tasa|cambio|api/i.test(msg) ? 502 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
