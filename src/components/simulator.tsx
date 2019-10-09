import React, { useReducer } from "react"
import style from "./simulator.module.scss"

import { useInterval } from "../lib/use-interval";
import { IActivity } from "../lib/activity-stream";
import { stateReducer } from "../store/reducers";
import { InitializeSimulation, ShutdownSimulation, ProcessClick, Play, Pause } from "../store/actions";
import { initialState } from "../store/reducers/simulation.reducer";

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

const Simulator = () => {

  const [state, dispatch] = useReducer(stateReducer, initialState);

  const numberParticipants = 100;
  const {
    initialized,
    playSpeed,
    lastClick,
    activities
  } = state;
  
  const participants = state.participants.list;
  const enterprises = state.enterprises.list;

  useInterval(() => {
    dispatch(new ProcessClick());
  }, playSpeed);

  const stop = () => {
    dispatch(new ShutdownSimulation());
  }

  const start = () => {
    dispatch(new InitializeSimulation(numberParticipants))
  }

  const play = () => {
    dispatch(new Play())
  }

  const pause = () => {
    dispatch(new Pause())
  }

  const click = () => {
    dispatch(new ProcessClick())
  }

  const recentActivities = activities.filter((activity) => activity.click === lastClick);

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
      {!initialized && <button onClick={start}>Start Simulation</button>}
      {initialized && <button onClick={stop}>End Simulation</button>}
      {Boolean(initialized && !playSpeed) && <button onClick={play}>Play</button>}
      {Boolean(initialized && playSpeed) && <button onClick={pause}>Pause</button>}
      {initialized && <button onClick={click}>Step Forward</button>}
    </div>
  );
}

export default Simulator;
