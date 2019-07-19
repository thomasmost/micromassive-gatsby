import { useState } from "react";
import { IMarketParticipant } from "./market-participants";
import {v4 as uuid} from 'uuid';
import * as faker from 'faker';

export interface IEnterprise {
  id: string;
  name: string;
  founder: IMarketParticipant;
  size: number;
  employees: IMarketParticipant[];
}

export const useEnterprises = (addActivity: (click: number, text: string) => void) => {
  const [enterprises, setEnterprises] = useState<IEnterprise[]>([]);
  const startEnterprise = (clickNumber: number, founder: IMarketParticipant) => {
    const newEnterprises = enterprises.slice()
    const id = uuid();
    const name = faker.company.companyName();
    const size = 3;
    const employees = [];
    newEnterprises.push({
      id,
      name,
      founder,
      size,
      employees,
    })
    const activityText = `${founder.name} founded ${name}`;
    addActivity(clickNumber, activityText);
    setEnterprises(newEnterprises);
  }

  const addEmployee = (clickNumber: number, enterpriseId: string, employee: IMarketParticipant) => {
    const newEnterprises = enterprises.slice();
    let enterpriseName;
    for (const enterprise of newEnterprises) {
      if (enterprise.id === enterpriseId) {
        enterpriseName = enterprise.name;
        enterprise.employees.push(employee);
        break;
      }
    }
    const activityText = `${employee.name} joined ${enterpriseName}`;
    addActivity(clickNumber, activityText);
    setEnterprises(newEnterprises);
  }

  const resetEnterprises = () => {
    setEnterprises([]);
  }
  return {enterprises, startEnterprise, addEmployee, resetEnterprises}
}
