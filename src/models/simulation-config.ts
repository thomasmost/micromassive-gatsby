export interface ISimulationConfig {
  costOfPersonalLabor: number;
  enterpriseStartCost: number;
  maximumProductsOfPersonalLabor: number;
  numberOfParticipants: number;
}

export const defaultConfiguration: ISimulationConfig = {
  costOfPersonalLabor: 2,
  enterpriseStartCost: 11,
  maximumProductsOfPersonalLabor: 5,
  numberOfParticipants: 50
}