
export function salePriceForIndividualProductsOfLabor(investment: number, maxProductsPossible: number, numberProduced: number) {
  
  const hopefulProfit = (investment * maxProductsPossible) / (2 * numberProduced)

  return hopefulProfit + (investment / numberProduced);
}