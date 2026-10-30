
export function hasString(str: string|null): boolean {
  return str != null && str.trim() != ''
}

export function isClientNextjs(): boolean {
  return typeof window !== 'undefined';
}