import { IActivity } from "./activity-stream";
import { EntityStore } from "./entity-store";
import { IMarketParticipant } from "./market-participant";
import { IEnterprise } from "./enterprise";
import { ISimulationConfig } from "./simulation-config";

export interface ISimulationState {
  initialized: boolean;
  playSpeed: number;
  lastClick: number;
  config: ISimulationConfig;
  activities: IActivity[];
  participants: EntityStore<IMarketParticipant>;
  enterprises: EntityStore<IEnterprise>;
}