export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function parseCurrency(value? : string): number {
  return value ? parseFloat(value.replace(/[R$\s.]/g, "").replace(",", ".")) : 0;
}

export function calcUnityValueByQuantity(value? : number, quantity?: number) : number {
  return value && quantity && quantity > 0 && value > 0 ? (value / quantity) : 0;
}