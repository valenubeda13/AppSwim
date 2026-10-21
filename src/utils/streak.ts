/** "0 días", "1 día", "12 días" */
export function formatStreakDays(days: number): string {
  return `${days} ${days === 1 ? 'día' : 'días'}`;
}

/**
 * Frase debajo de la racha, según cuántos días lleva. Con 0 no festeja:
 * invita a arrancar (o a retomar, si la racha se cortó).
 */
export function getStreakMessage(days: number): string {
  if (days <= 0) return '¡Hoy es un buen día para arrancar!';
  if (days === 1) return '¡Buen comienzo, seguí así!';
  if (days < 7) return '¡Vas muy bien!';
  return '¡Seguís imparable!';
}
