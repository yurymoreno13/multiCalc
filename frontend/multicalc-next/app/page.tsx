// app/page.tsx
import UnitConverter from "./components/UnitConverter";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-center text-3xl font-bold tracking-tight">MultiCalc</h1>
        <UnitConverter />
      </div>
    </main>
  );
}

