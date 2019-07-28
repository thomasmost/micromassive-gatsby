import React, { useState, useRef, useEffect } from "react"
import style from "./simulator.module.scss"

import { connect } from 'react-redux';

import { useMarketParticipants } from "../lib/market-participants";
import { useEnterprises } from "../lib/enterprises";
import { processClick } from "../lib/process-click";
import { useInterval } from "../lib/use-interval";
import { useActivityStream, IActivity } from "../lib/activity-stream";
import { IAppStateContainer } from "../store/reducers";
import { InitializeSimulation, ShutdownSimulation } from "../store/actions";
import { Dispatch } from "redux";

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

const RecentActivities = ({recentActivities} : {recentActivities: IActivity[]}) => {

  const activityBlocks = recentActivities.map((activity) => (
    <div>
      {activity.text}
    </div>
  ))

  return (
    <div>
      <label>
        Click {recentActivities[0].click}
      </label>
      {activityBlocks}
    </div>
  )
}

interface ISimulatorProps {
  simulationInProgress: boolean;
  initializeSimulation: () => void;
  shutdownSimulation: () => void;
}

const Simulator = (props) => {
  const {
    simulationInProgress,
    initializeSimulation,
    shutdownSimulation
  } = props;
  const numberParticipants = 100;
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
    shutdownSimulation();
    adjustPlaySpeed(null)
  }

  const start = () => {
    initializeSimulation();
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
  
  const mostRecentClick = numClicks;
  const recentActivities = activities.filter((activity) => activity.click === mostRecentClick);

  return (
    <div className={style.simulator}>
      <div className={style.colLeft}>
        <StatBlock label="# Participants" value={participants.length} />
        <StatBlock label="# Enterprises" value={enterprises.length} />
      </div>
      <div className={style.colRight}>
        {Boolean(recentActivities.length) && <RecentActivities recentActivities={recentActivities} />}
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
export default connect((state: IAppStateContainer) => (
  {
    simulationInProgress: state.simulator.initialized
  }
),(dispatch: Dispatch) => (
  {
    initializeSimulation: () => dispatch(new InitializeSimulation()),
    shutdownSimulation: () => dispatch(new ShutdownSimulation()),
  }
))(Simulator)
