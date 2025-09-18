// frontend/multicalc-next/components/PercentageTool.tsx
"use client";
import { useState } from "react";
import { Input } from "./ui/Input";
import { CardTitle } from "./ui/Card";
import { percentageDiscount } from "@/lib/calculators";


export default function PercentageTool() {
const [price, setPrice] = useState(100);
const [discount, setDiscount] = useState(20);
const result = percentageDiscount(price, discount);


return (
<div>
<CardTitle>Porcentajes</CardTitle>
<div className="grid gap-3 sm:grid-cols-2">
<Input label="Precio" type="number" step="any" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
<Input label="Descuento (%)" type="number" step="any" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
</div>
<p className="mt-4 text-base"><strong>Total con descuento:</strong> {result}</p>
</div>
);
}