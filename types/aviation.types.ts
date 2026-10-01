export interface AircraftLimits {
  mzfw: number;
  mtow: number;
  mlw: number;
}

export interface TrimConfig {
  referenceArm: number;
  indexConstant: number;
  lemac: number;
  macLength: number;
}

export interface AircraftConfig {
  id: string;
  model: string;
  dow: number;
  doi: number;
  limits: AircraftLimits;
  trim: TrimConfig;
}

export interface PayloadItem {
  id: string;
  type: 'PAX' | 'CARGO' | 'BAG';
  weight: number;
  arm: number;
}

export interface FlightState {
  // State variables
  aircraft: AircraftConfig | null;
  payload: PayloadItem[];
  takeoffFuel: number;
  
  // Actions (These are the missing lines causing the 6 errors!)
  initializeFlight: (aircraft: AircraftConfig) => void;
  addPayload: (item: PayloadItem) => void;
  setTakeoffFuel: (fuel: number) => void;
}