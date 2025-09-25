export function parseNumber(n : number | undefined, fraction : number = 0): string {
  if (n === undefined || n === null || isNaN(n)) return '';
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction
  });
}