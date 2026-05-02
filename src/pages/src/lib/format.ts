export function formatEUR(value: number | null | undefined): string {
  if (value == null) return '0 €';
  
  // Fuerza el formato español (Puntos para miles) y elimina los céntimos
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
}