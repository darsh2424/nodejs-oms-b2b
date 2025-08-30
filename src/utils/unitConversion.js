const conversionMap = {
  kg: { g: 1000 },
  g: { kg: 0.001 },
  liter: { ml: 1000 },
  ml: { liter: 0.001 },
  unit: { unit: 1 }
};

exports.convert = (value, from, to) => {
  if (from === to) return value;
  if (conversionMap[from] && conversionMap[from][to]) {
    return value * conversionMap[from][to];
  }
  throw new Error(`Conversion not supported: ${from} → ${to}`);
};
