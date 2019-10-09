
export const INITIALIZE_SIMULATION = 'INITIALIZE_SIMULATION';
export const SHUTDOWN_SIMULATION = 'SHUTDOWN_SIMULATION';
export const PLAY = 'PLAY';
export const PAUSE = 'PAUSE';
export const PROCESS_CLICK = 'PROCESS_CLICK';

export class InitializeSimulation {
  readonly type = INITIALIZE_SIMULATION;
  constructor (
    public numPartipants: number
  ) {}
}

export class ShutdownSimulation {
  readonly type = SHUTDOWN_SIMULATION;
  constructor () {}
}

export class Play {
  readonly type = PLAY;
  constructor () {}
}

export class Pause {
  readonly type = PAUSE;
  constructor () {}
}


export class ProcessClick {
  readonly type = PROCESS_CLICK;
  constructor () {}
}


export type SimulatorAction =
  InitializeSimulation |
  ShutdownSimulation |
  Play |
  Pause |
  ProcessClick;
