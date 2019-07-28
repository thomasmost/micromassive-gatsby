
export const INITIALIZE_SIMULATION = 'INITIALIZE_SIMULATION';
export const SHUTDOWN_SIMULATION = 'SHUTDOWN_SIMULATION';
export const PLAY = 'PLAY';
export const PAUSE = 'PAUSE';
export const STEP_FORWARD = 'STEP_FORWARD';

export class InitializeSimulation {
  readonly type = INITIALIZE_SIMULATION;
  constructor () {}
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

export class StepForward {
  readonly type = STEP_FORWARD;
  constructor () {}
}


export type SimulatorAction =
  InitializeSimulation |
  ShutdownSimulation |
  Play |
  Pause |
  StepForward;
