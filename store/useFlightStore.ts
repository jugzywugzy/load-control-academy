import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FlightState, AircraftConfig } from '../types/aviation.types';

export const GENERIC_A320: AircraftConfig = {
  id: 'A320-GENERIC',
  model: 'Airbus A320-200 (Training)',
  dow: 42600,
  doi: 50.0,
  limits: {
    mzfw: 62500,
    mtow: 77000,
    mlw: 66000,
  },
  trim: {
    referenceArm: 14.0,
    indexConstant: 50000,
    lemac: 17.5,
    macLength: 4.19,
  }
};

export const GENERIC_B738: AircraftConfig = {
  id: 'B738-GENERIC',
  model: 'Boeing 737-800 (Training)',
  dow: 41413,
  doi: 50.0,
  limits: {
    mzfw: 62731,
    mtow: 79015,
    mlw: 66360,
  },
  trim: {
    referenceArm: 12.0,
    indexConstant: 50000,
    lemac: 15.5,
    macLength: 4.16,
  }
};

// FIX: We wrap our store in persist() to automatically save to the browser
export const useFlightStore = create<FlightState>()(
  persist(
    (set) => ({
      aircraft: null,
      payload: [],
      takeoffFuel: 0,
      
      initializeFlight: (aircraft) => set({ aircraft, payload: [], takeoffFuel: 0 }),
      
      addPayload: (item) => set((state) => ({ 
        payload: [...state.payload, item] 
      })),
      
      setTakeoffFuel: (fuel) => set({ takeoffFuel: fuel }),
    }),
    {
      name: 'lca-flight-storage', // The secret key used in Local Storage
    }
  )
);