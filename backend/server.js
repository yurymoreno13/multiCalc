// backend/server.js
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// ----- CONVERSIONES -----
function convertLength(value, from, to) {
  const map = { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 };
  if (!(from in map) || !(to in map)) throw new Error("Unidad de longitud no soportada");
  return (value * map[from]) / map[to];
}
function convertWeight(value, from, to) {
  const map = { g: 0.001, kg: 1, lb: 0.45359237, oz: 0.028349523125 };
  if (!(from in map) || !(to in map)) throw new Error("Unidad de peso no soportada");
  return (value * map[from]) / map[to];
}
function cToF(c){ return (c*9)/5+32; }
function fToC(f){ return ((f-32)*5)/9; }
function cToK(c){ return c+273.15; }
function kToC(k){ return k-273.15; }
function convertTemp(value, from, to) {
  let c;
  if (from === "C") c = value;
  else if (from === "F") c = fToC(value);
  else if (from === "K") c = kToC(value);
  else throw new Error("Unidad de temperatura no soportada");

  if (to === "C") return c;
  if (to === "F") return cToF(c);
  if (to === "K") return cToK(c);
  throw new Error("Unidad de temperatura no soportada");
}

// ----- RUTA API -----
app.post("/api/convert", (req, res) => {
  try {
    const { category, from, to, value } = req.body || {};
    if (typeof value !== "number") return res.status(400).json({ error: "value debe ser número" });
    if (!category || !from || !to) return res.status(400).json({ error: "Faltan parámetros" });

    let result;
    if (category === "length") result = convertLength(value, from, to);
    else if (category === "weight") result = convertWeight(value, from, to);
    else if (category === "temperature") result = convertTemp(value, from, to);
    else return res.status(400).json({ error: "Categoría no soportada" });

    if (Number.isNaN(result)) return res.status(400).json({ error: "Conversión inválida" });
    res.json({ result });
  } catch (e) {
    res.status(400).json({ error: e.message || "Error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API lista en http://localhost:${PORT}`));
