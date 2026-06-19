export const COP_PER_POINT = 50; // 1 punto = 50 COP
// Nueva regla: hacer que los puntos sean más difíciles de conseguir.
// Ejemplo: una compra de 10.000 COP otorga 5 puntos => 1 punto por cada 2.000 COP
export const COP_SPENT_PER_POINT = 2000; // se gana 1 punto por cada 2000 COP gastados

export function pointsFromAmount(amountCOP: number) {
  return Math.floor(amountCOP / COP_SPENT_PER_POINT);
}

export function amountFromPoints(points: number) {
  return points * COP_PER_POINT;
}
