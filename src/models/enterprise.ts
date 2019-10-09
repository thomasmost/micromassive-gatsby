import { IMarketParticipant } from "./market-participants";

export interface IEnterprise {
  id: string;
  name: string;
  founderId: string;
  size: number;
  employees: IMarketParticipant[];
}
