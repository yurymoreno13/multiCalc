// frontend/multicalc-next/lib/calculators.ts
export const UNIT_OPTIONS = {
length: [
{ code: "m", label: "Metros" },
{ code: "cm", label: "Centímetros" },
{ code: "km", label: "Kilómetros" },
{ code: "in", label: "Pulgadas" },
{ code: "ft", label: "Pies" },
],
weight: [
{ code: "kg", label: "Kilogramos" },
{ code: "g", label: "Gramos" },
{ code: "lb", label: "Libras" },
],
temperature: [
{ code: "C", label: "Celsius" },
{ code: "F", label: "Fahrenheit" },
{ code: "K", label: "Kelvin" },
],
} as const;


export type Category = keyof typeof UNIT_OPTIONS;


// utilidades locales (por si el backend no está disponible)
export function percentageDiscount(price: number, discount: number) {
return price - price * (discount / 100);
}


export function bmi(heightMeters: number, weightKg: number) {
if (heightMeters <= 0) return { bmi: 0, status: "Altura inválida" } as const;
const value = weightKg / (heightMeters * heightMeters);
let status = "";
if (value < 18.5) status = "Bajo peso";
else if (value < 25) status = "Normal";
else if (value < 30) status = "Sobrepeso";
else status = "Obesidad";
return { bmi: Number(value.toFixed(2)), status } as const;
}