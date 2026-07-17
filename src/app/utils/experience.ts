export const EXPERIENCE_START_YEAR = 2019;

/**
 * Años enteros de experiencia calculados a partir del año en curso.
 * Se evalúa al instanciar el componente (no en cada change detection),
 * por lo que el número se mantiene estable durante toda la vida del SPA
 * y solo cambia cuando el navegador pasa de 31 dic → 1 ene.
 */
export function yearsOfExperience(now: Date = new Date()): number {
  return now.getFullYear() - EXPERIENCE_START_YEAR;
}
