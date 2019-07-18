import React, { useState } from "react"
import style from "./simulator.module.scss"

import {v4 as uuid} from 'uuid';
import * as faker from 'faker';


interface IMarketParticipant {
  id: string;
  name: string;
}

interface IEnterprise {
  id: string;
  name: string;
  founder: IMarketParticipant;
  size: number;
  employees: IMarketParticipant[];
}

const industries = [

]

const useMarketParticipants = () => {
  const [participants, setParticipants] = useState<IMarketParticipant[]>([]);
  const createParticipants = (count: number) => {
    let newParticipants = [];
    for (let i = 0; i < count; i++) {
      const id = uuid();
      const name = faker.name.findName();
      newParticipants.push({
        id,
        name
      });
    }
    setParticipants(newParticipants);
  }

  const resetParticipants = () => {
    setParticipants([]);
  }
  return {participants, createParticipants, resetParticipants}
}


const useEnterprises = () => {
  const [enterprises, setEnterprises] = useState<IEnterprise[]>([]);
  const startEnterprise = (name: string, founder: IMarketParticipant) => {
    const newEnterprises = enterprises.slice();
    const id = uuid();
    const size = 3;
    const employees = [];
    newEnterprises.push({
      id,
      name,
      founder,
      size,
      employees,
    })
    setEnterprises(newEnterprises);
  }

  const resetEnterprises = () => {
    setEnterprises([]);
  }
  return {enterprises, startEnterprise, resetEnterprises}
}

const startSimulation = (
  numberParticipants: number,
  createParticipants: (n: number) => void
) => {
  createParticipants(numberParticipants);
}

const processClick = (
  participants: IMarketParticipant[],
  enterprises: IEnterprise[],
  startEnterprise: (name: string, founder: IMarketParticipant) => void,
) => {

  // MPs with sufficient capital begin enterprises
  // MPs without jobs try to get jobs
  // MPs with jobs get paid
  // MPs with sufficient capital make purchases
  // Purchases cause externality damage
  // Purchases increase value index/QOL index

  const founderIds = enterprises.map((enterprise) => enterprise.founder.id);
  for (const participant of participants) {
    if (!founderIds.includes(participant.id)) {
      startEnterprise(faker.company.companyName(), participant);
    }
  }
}

const StatBlock = ({label, value}) => (
  <div className={style.statblock}>
    <label>{label}</label>
    <div>{value}</div>
  </div>
)

const Simulator = () => {
  const numberParticipants = 100;
  const [simulationInProgress, toggleSimulation] = useState<boolean>(false);
  const {enterprises, startEnterprise, resetEnterprises} = useEnterprises();
  const {participants, createParticipants, resetParticipants} = useMarketParticipants();

  const stop = () => {
    toggleSimulation(false);
  }

  const start = () => {
    toggleSimulation(true);
    resetEnterprises();
    resetParticipants();
    startSimulation(numberParticipants, createParticipants);
  }

  const click = () => {
    processClick(participants, enterprises, startEnterprise);
  }

  return (
    <div className={style.simulator}>
      <StatBlock label="# Participants" value={participants.length} />
      <StatBlock label="# Enterprises" value={enterprises.length} />
      {!simulationInProgress && <button onClick={start}>Start Simulation</button>}
      {simulationInProgress && <button onClick={stop}>End Simulation</button>}
      {simulationInProgress && <button onClick={click}>Step Forward</button>}
    </div>
  );
}
export default Simulator
