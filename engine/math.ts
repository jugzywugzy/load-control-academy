import { AircraftTrimConfig } from '../types/aviation.types';

/**
 * Calculates the rotational force (moment) of a specific weight.
 */
export const calculateMoment = (weightKg: number, armMeters: number): number => {
  return weightKg * armMeters;
};

/**
 * Scales a massive moment down to a manageable Index value.
 */
export const calculateIndexShift = (
  weightKg: number,
  arm: number,
  trimConfig: AircraftTrimConfig
): number => {
  const momentChange = weightKg * (arm - trimConfig.referenceArm);
  return Number((momentChange / trimConfig.indexConstant).toFixed(2));
};

/**
 * Translates a physical Center of Gravity arm into an aerodynamic percentage (%MAC).
 */
export const calculateMAC = (
  cgArm: number,
  trimConfig: AircraftTrimConfig
): number => {
  const mac = ((cgArm - trimConfig.lemac) / trimConfig.macLength) * 100;
  return Number(mac.toFixed(2));
};

/**
 * Aggregates all payload items to find the total physical CG.
 */
export const calculateTotalCG = (
  emptyWeight: number,
  emptyArm: number,
  payload: { weight: number; arm: number }[]
): number => {
  let totalWeight = emptyWeight;
  let totalMoment = emptyWeight * emptyArm;

  for (const item of payload) {
    totalWeight += item.weight;
    totalMoment += calculateMoment(item.weight, item.arm);
  }

  return totalWeight === 0 ? 0 : Number((totalMoment / totalWeight).toFixed(3));
};