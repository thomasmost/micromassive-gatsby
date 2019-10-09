import { IMarketParticipant } from "./market-participants";
import { IEnterprise } from "./enterprises";
import { useReducer } from "react";
import { EntityStore } from "../store/reducers/simulation.reducer";
import { IActivity } from "./activity-stream";

import {v4 as uuid} from 'uuid';
import * as faker from 'faker';

export const processClick = (
  click,
  participantStore: EntityStore<IMarketParticipant>,
  enterpriseStore: EntityStore<IEnterprise>) => {

  const newActivities: IActivity[] = [];
  const enterprises = enterpriseStore.list;
  const participants = participantStore.list;

  const employedParticipantIds = []
  for (const enterprise of enterprises) {
    const employeeIds = enterprise.employees.map((employee) => employee.id)
    employeeIds.push(enterprise.founderId);
    employedParticipantIds.push(...employeeIds);
  }

  // 1. MPs with sufficient capital begin enterprises
  for (const participant of participants) {
    if (!employedParticipantIds.includes(participant.id)) {
      const id = uuid();
      const name = faker.company.companyName();
      const size = 3;
      const employees = [];
      const founderId = participant.id;
      const newEnterprise = {
        id,
        name,
        founderId,
        size,
        employees
      };
      const activityText = `${participant.name} founded ${name}`;
      newActivities.push({
        click,
        text: activityText
      });
      enterpriseStore.add(newEnterprise);
      break;
    }
  }

  // 2. MPs without jobs try to get jobs

  const unemployedParticipants = participants.filter((participant) => 
    !employedParticipantIds.includes(participant.id)
  );

  // for (const participant of unemployedParticipants) {
  //   let foundJob = false;
  //   for (const enterprise of enterprises) {
  //     if (enterprise.size > enterprise.employees.length) {
  //       foundJob = true;
  //       // addEmployee(clickNumber, enterprise.id, participant);
  //       break;
  //     }
  //   }
  //   if (!foundJob) {
  //     break;
  //   }
  // }

  // 3. MPs with jobs get paid
  // 4. MPs with sufficient capital make purchases
  // 5. Purchases cause externality damage
  // 6. Purchases increase value index/QOL index
  // 7. Enterprises that made sales grow?

  return {
    newActivities,
    participantStore,
    enterpriseStore
  }

}