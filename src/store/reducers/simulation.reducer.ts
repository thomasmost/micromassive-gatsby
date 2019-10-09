import { INITIALIZE_SIMULATION, SimulatorAction, SHUTDOWN_SIMULATION, PLAY, PAUSE, PROCESS_CLICK } from "../actions";
import { Reducer } from "react";
import { IMarketParticipant } from "../../lib/market-participants";
import { IEnterprise } from "../../lib/enterprises";

import {v4 as uuid} from 'uuid';
import * as faker from 'faker';
import { IActivity } from "../../lib/activity-stream";
import { processClick } from "../../lib/process-click";

interface IEntity {
  id: string;
}

interface IEntityStore<T extends IEntity> {
  list: T[];
  byId: Record<string, T>;
}

export class EntityStore<T extends IEntity> implements IEntityStore<T> {
  list: T[];
  byId: Record<string, T>;
  constructor() {
    this.list = [];
    this.byId = {};
  };

  public initialize(entities: T[]) {
    if (this.list.length) {
      throw Error('Would not expect to initialize a non-empty store');
    }
    this.list = [];
    this.byId = {};
    for (const entity of entities) {
      this.list.push(entity)
      this.byId[entity.id] = entity;
    }
    return this;
  }

  public add(entity: T) {
    this.list = [...this.list, entity];
    this.byId = {...this.byId};
    this.byId[entity.id] = entity;
    return this;
  }

  public remove(id: string) {
    const newList = [];
    for (const item of this.list) {
      if (item.id !== id) {
        newList.push(item);
      }
    }
    this.list = newList;
    this.byId = {...this.byId};
    delete this.byId[id];
    return this;
  }

  public reset() {
    this.list = [];
    this.byId = {};
    return this;
  }

}

// class EmployeeStore {
//   employeeIdsByEnterpriseId: Record<string, string[]>
//   enterpriseIdByEmployeeId: Record<string, string>
// }

interface ISimulationState {
  initialized: boolean;
  playSpeed: number;
  lastClick: number;
  activities: IActivity[];
  participants: EntityStore<IMarketParticipant>;
  enterprises: EntityStore<IEnterprise>;
}

export const initialState: ISimulationState = {
  initialized: false,
  playSpeed: null,
  lastClick: 0,
  activities: [],
  participants: new EntityStore<IMarketParticipant>(),
  enterprises: new EntityStore<IEnterprise>()
}

export const simulationReducer: Reducer<ISimulationState, SimulatorAction> =
(state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE_SIMULATION: {
      const participants = new EntityStore<IMarketParticipant>();

      let newParticipants: IMarketParticipant[] = [];
      for (let i = 0; i < action.numPartipants; i++) {
        const id = uuid();
        const name = faker.name.findName();
        newParticipants.push({
          id,
          name
        });
      }
      participants.initialize(newParticipants);

      const enterprises = new EntityStore<IEnterprise>();
      const activities = [];

      return {
        initialized: true,
        playSpeed: null,
        lastClick: 0,
        activities,
        participants,
        enterprises
      }
    }
    case SHUTDOWN_SIMULATION:
      return {
        ...state,
        initialized: false,
        participants: state.participants.reset(),
        enterprises: state.enterprises.reset()
      }
    case PLAY: {
      if (!state.initialized) {
        return state;
      }
      return {...state, playSpeed: 1000}
    }
    case PAUSE: {
      if (!state.initialized) {
        return state;
      }
      return {...state, playSpeed: null}
    }
    case PROCESS_CLICK: {
      if (!state.initialized) {
        return state;
      }
      const click = state.lastClick + 1;
      const {
        newActivities,
        participantStore,
        enterpriseStore
      } = processClick(click, state.participants, state.enterprises);
      return {
        ...state,
        lastClick: click,
        activities: [...state.activities, ...newActivities],
        participants: participantStore,
        enterprises: enterpriseStore
      }
    }
    default:
      return state;
  }
}
