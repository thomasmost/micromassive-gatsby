import { IMarketParticipant } from "../models/market-participant";
import { IEnterprise } from "../models/enterprise";
import { IActivity } from "../models/activity-stream";

import {v4 as uuid} from 'uuid';
import * as faker from 'faker';
import { EntityStore } from "../models/entity-store";
import { ISimulationConfig } from "../models/simulation-config";
import { personalLabors } from "../models/personal-labor";
import { salePriceForIndividualProductsOfLabor } from "./salePriceForProductsOfLabor";

export const processClick = (
  click,
  config: ISimulationConfig,
  participantStore: EntityStore<IMarketParticipant>,
  enterpriseStore: EntityStore<IEnterprise>) => {

  const newActivities: IActivity[] = [];
  const enterprises = enterpriseStore.list;

  const employedParticipantIds = []
  let employedParticipants = [];
  for (const enterprise of enterprises) {
    const employeeIds = enterprise.employees.map((employee) => employee.id)
    employeeIds.push(enterprise.founderId);
    employedParticipantIds.push(...employeeIds);
    employedParticipants = employedParticipantIds.map((id) => {
      return participantStore.byId[id];
    })
  }

  const participantsWhoWillBuyProducts = [];

  for (const employee of employedParticipants) {
    newActivities.push({
      click,
      text: `${employee.name} worked at their job`
    });
  }

  // 1. MPs with sufficient capital begin enterprises
  for (const participant of participantStore.list) {
    participantStore.modify(participant.id, {
      expiringProducts: []
    });
    if (!employedParticipantIds.includes(participant.id)) {
      // not employed
      if (participant.capital > config.enterpriseStartCost) {
        const founderId = participant.id;
        const newCapital = participant.capital - config.enterpriseStartCost;
        participantStore.modify(founderId, {capital: newCapital })
        const id = uuid();
        const name = faker.company.companyName();
        const size = 3;
        const employees = [];
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
      }
      else if (participant.capital > config.costOfPersonalLabor) {

        // replace with deterministic randomizer
        const laborIndex = Math.floor((Math.random() * personalLabors.length)) % personalLabors.length;

        const labor = personalLabors[laborIndex];

        const numberOfProducts = Math.floor((Math.random() * (config.maximumProductsOfPersonalLabor + 1)));

        const expiringProducts = [];

        for (let i = 0; i < numberOfProducts; i++) {
          expiringProducts.push(labor.product);
        }
        const salePriceForExpiringProducts = salePriceForIndividualProductsOfLabor(config.costOfPersonalLabor, config.maximumProductsOfPersonalLabor, numberOfProducts);

        const activityText = `${participant.name} ${labor.action} and produced ${numberOfProducts} ${labor.product}.`;

        const newCapital = participant.capital - config.costOfPersonalLabor;

        if (numberOfProducts === 0 && newCapital > 1) {
          participantsWhoWillBuyProducts.push(participant)
        }

        participantStore.modify(participant.id, {
          capital: newCapital,
          expiringProducts,
          salePriceForExpiringProducts
        });

        newActivities.push({
          click,
          text: activityText
        });
      }
      else {
        const activityText = `${participant.name} subsisted.`;
        newActivities.push({
          click,
          text: activityText
        });
      }
    }
  }

  const sellers = participantStore.list.filter((seller) => seller.expiringProducts.length > 1);

  const sortedSellers = sellers.sort((a, b) => a.salePriceForExpiringProducts - b.salePriceForExpiringProducts);

  for (const buyer of participantsWhoWillBuyProducts) {
    for (const seller of sortedSellers) {
      if (seller.expiringProducts.length > 1) {
        const products = seller.expiringProducts;
        const product = products[0];
        const newProducts = products;
        newProducts.length = newProducts.length - 1;
        const price = seller.salePriceForExpiringProducts;
        participantStore.modify(buyer.id, {
          capital: buyer.capital - price
        });
        seller.capital = seller.capital + price;
        participantStore.modify(seller.id, {
          capital: seller.capital,
          expiringProducts: products
        });
        

        const activityText = `${buyer.name} bought ${product} from ${seller.name} for ${price}.`;
        newActivities.push({
          click,
          text: activityText
        });
        break;
      }
    }
  }

  // 2. MPs without jobs try to get jobs

  const unemployedParticipants = participantStore.list.filter((participant) => 
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