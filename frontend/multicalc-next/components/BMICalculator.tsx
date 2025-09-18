// frontend/multicalc-next/components/BMICalculator.tsx
"use client";
import { useState } from "react";
import { Input } from "./ui/Input";
import { CardTitle } from "./ui/Card";
import { bmi } from "@/lib/calculators";


export default function BMICalculator() {
const [height, setHeight] = useState(1.75);
const [weight, setWeight] = useState(70);
const { bmi: value, status } = bmi(height, weight);


return (
<div>
<CardTitle>IMC</CardTitle>
<div className="grid gap-3 sm:grid-cols-2">
<Input label="Altura (m)" type="number" step="any" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
<Input label="Peso (kg)" type="number" step="any" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
</div>
<p className="mt-4 text-base"><strong>IMC:</strong> {value} – {status}</p>
</div>
);
}