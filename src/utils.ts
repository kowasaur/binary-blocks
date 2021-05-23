export function binary(decimal: number, digits?: number) {
  const bin = decimal.toString(2);
  if (bin.length > (digits ?? 1000000)) {
    throw new Error("Length is longer than digits");
  }
  return digits ? "0".repeat(digits - bin.length) + bin : bin;
}
