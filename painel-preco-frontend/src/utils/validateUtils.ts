
export function hasString(str: string): boolean {
  return str != null && str.trim() != ''
}

export function verifyIsOnlyClientNextjs(): boolean {
  return typeof window !== 'undefined';
}