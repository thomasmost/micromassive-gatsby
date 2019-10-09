export interface IMarketParticipant {
  id: string;
  name: string;
  capital: number;
  expiringProducts: string[];
  salePriceForExpiringProducts: number;
}
