import { IMarketParticipant } from "./market-participants";
import { IEnterprise } from "./enterprises";

export const processClick = (
  clickNumber: number,
  participants: IMarketParticipant[],
  enterprises: IEnterprise[],
  startEnterprise: (clickNumber: number, founder: IMarketParticipant) => void,
  addEmployee: (clickNumber: number, enterpriseId: string, employee: IMarketParticipant) => void,
) => {

  const employedParticipantIds = []
  for (const enterprise of enterprises) {
    const employeeIds = enterprise.employees.map((employee) => employee.id)
    employeeIds.push(enterprise.founder.id);
    employedParticipantIds.push(...employeeIds);
  }

  // 1. MPs with sufficient capital begin enterprises
  for (const participant of participants) {
    if (!employedParticipantIds.includes(participant.id)) {
      startEnterprise(clickNumber, participant);
      break;
    }
  }

  // 2. MPs without jobs try to get jobs

  const unemployedParticipants = participants.filter((participant) => 
    !employedParticipantIds.includes(participant.id)
  );

  for (const participant of unemployedParticipants) {
    let foundJob = false;
    for (const enterprise of enterprises) {
      if (enterprise.size > enterprise.employees.length) {
        foundJob = true;
        addEmployee(clickNumber, enterprise.id, participant);
        break;
      }
    }
    if (!foundJob) {
      break;
    }
  }

  // 3. MPs with jobs get paid
  // 4. MPs with sufficient capital make purchases
  // 5. Purchases cause externality damage
  // 6. Purchases increase value index/QOL index
  // 7. Enterprises that made sales grow?

}