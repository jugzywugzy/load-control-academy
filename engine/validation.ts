import { FlightState } from '../types/aviation.types';

export interface ValidationResult {
  isValid: boolean;
  actual: number;
  margin: number;
  error?: string;
}

export const checkZFW = (state: FlightState): ValidationResult => {
  if (!state.aircraft) return { isValid: false, actual: 0, margin: 0, error: 'No aircraft selected' };
  
  const payloadWeight = state.payload.reduce((sum, item) => sum + item.weight, 0);
  const zfw = state.aircraft.dow + payloadWeight;
  const margin = state.aircraft.limits.mzfw - zfw;

  return {
    isValid: zfw <= state.aircraft.limits.mzfw,
    actual: zfw,
    margin,
    error: zfw > state.aircraft.limits.mzfw 
      ? `MZFW Exceeded by ${Math.abs(margin)} kg. Risk of wing-root structural failure.` 
      : undefined
  };
};

export const checkTOW = (state: FlightState, currentZfw: number): ValidationResult => {
  if (!state.aircraft) return { isValid: false, actual: 0, margin: 0, error: 'No aircraft selected' };

  const tow = currentZfw + state.takeoffFuel;
  const margin = state.aircraft.limits.mtow - tow;

  return {
    isValid: tow <= state.aircraft.limits.mtow,
    actual: tow,
    margin,
    error: tow > state.aircraft.limits.mtow
      ? `MTOW Exceeded by ${Math.abs(margin)} kg. Aircraft too heavy for safe departure.`
      : undefined
  };
};