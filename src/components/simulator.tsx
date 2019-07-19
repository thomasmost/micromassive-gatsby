import React, { useState, useRef, useEffect } from "react"
import style from "./simulator.module.scss"

import { useMarketParticipants } from "../lib/market-participants";
import { useEnterprises } from "../lib/enterprises";
import { processClick } from "../lib/process-click";
import { useInterval } from "../lib/use-interval";
import { useActivityStream } from "../lib/activity-stream";

const startSimulation = (
  numberParticipants: number,
  createParticipants: (n: number) => void
) => {
  createParticipants(numberParticipants);
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
  const [playSpeed, adjustPlaySpeed] = useState<number>(null);
  const [numClicks, setClicks] = useState<number>(0);
  const {activities, addActivity, resetActivitySTream} = useActivityStream();
  const {enterprises, startEnterprise, addEmployee, resetEnterprises} = useEnterprises(addActivity);
  const {participants, createParticipants, resetParticipants} = useMarketParticipants();

  const nextClick = numClicks + 1;


  useInterval(() => {
    setClicks(nextClick);
    processClick(nextClick, participants, enterprises, startEnterprise, addEmployee);
  }, playSpeed);

  const stop = () => {
    toggleSimulation(false);
    adjustPlaySpeed(null)
  }

  const start = () => {
    toggleSimulation(true);
    resetEnterprises();
    resetParticipants();
    resetActivitySTream();
    setClicks(0);
    startSimulation(numberParticipants, createParticipants);
  }

  const play = () => {
    adjustPlaySpeed(1000)
  }

  const pause = () => {
    adjustPlaySpeed(null)
  }

  const click = () => {
    setClicks(nextClick);
    processClick(nextClick, participants, enterprises, startEnterprise, addEmployee);
  }

  return (
    <div className={style.simulator}>
      <div className={style.colLeft}>
        <StatBlock label="# Participants" value={participants.length} />
        <StatBlock label="# Enterprises" value={enterprises.length} />
      </div>
      <div className={style.colRight}>
        {Boolean(activities.length) && <div><label>Click {activities[activities.length - 1].click}</label><div>{activities[activities.length - 1].text}</div></div>}
      </div>
      <div className={style.clear}/>
      {!simulationInProgress && <button onClick={start}>Start Simulation</button>}
      {simulationInProgress && <button onClick={stop}>End Simulation</button>}
      {Boolean(simulationInProgress && !playSpeed) && <button onClick={play}>Play</button>}
      {Boolean(simulationInProgress && playSpeed) && <button onClick={pause}>Pause</button>}
      {simulationInProgress && <button onClick={click}>Step Forward</button>}
    </div>
  );
}
export default Simulator
