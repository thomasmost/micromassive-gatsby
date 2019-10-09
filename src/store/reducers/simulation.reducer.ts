import { INITIALIZE_SIMULATION, SimulatorAction, SHUTDOWN_SIMULATION, PLAY, PAUSE, PROCESS_CLICK } from "../actions";
import { Reducer } from "react";
import { IMarketParticipant } from "../../models/market-participant";
import { IEnterprise } from "../../models/enterprise";

import {v4 as uuid} from 'uuid';
import * as faker from 'faker';
import { processClick } from "../../lib/process-click";
import { ISimulationState } from "../../models/simulation-state";
import { EntityStore } from "../../models/entity-store";
import { defaultConfiguration } from "../../models/simulation-config";

export const initialState: ISimulationState = {
  initialized: false,
  playSpeed: null,
  lastClick: 0,
  config: defaultConfiguration,
  activities: [],
  participants: new EntityStore<IMarketParticipant>(),
  enterprises: new EntityStore<IEnterprise>()
}

export const simulationReducer: Reducer<ISimulationState, SimulatorAction> =
(state, action) => {
  switch (action.type) {
    case INITIALIZE_SIMULATION: {
      const participants = new EntityStore<IMarketParticipant>();
      const actionConfig = action.config || {};
      const config = { ...defaultConfiguration, ...actionConfig};

      let newParticipants: IMarketParticipant[] = [];
      for (let i = 0; i < config.numberOfParticipants; i++) {
        const id = uuid();
        const name = faker.name.findName();
        newParticipants.push({
          id,
          name,
          capital: 10,
          expiringProducts: [],
          salePriceForExpiringProducts: null
        });
      }
      participants.initialize(newParticipants);

      const enterprises = new EntityStore<IEnterprise>();
      const activities = [];

      return {
        initialized: true,
        playSpeed: null,
        lastClick: 0,
        config,
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
      } = processClick(
          click,
          state.config,
          state.participants,
          state.enterprises
        );
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
