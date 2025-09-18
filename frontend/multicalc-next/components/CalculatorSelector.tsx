// components/CalculatorSelector.tsx
"use client";

import { useState } from "react";
import UnitConverter from "@/components/UnitConverter";

export default function CalculatorSelector() {
  const [tab, setTab] = useState("convert");

  return (
    <div className="p-6 border rounded-lg bg-white shadow">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("convert")}
          className={`px-3 py-2 rounded ${
            tab === "convert" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Conversor
        </button>
      </div>

      {tab === "convert" && <UnitConverter />}
    </div>
  );
}
