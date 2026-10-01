import { TrimConfig } from '../types/aviation.types';

// We changed payloadItems to accept any object with weight and arm, rather than strictly a PayloadItem
export function calculateTotalCG(emptyWeight: number, emptyArm: number, payloadItems: { weight: number; arm: number }[]): number {
  let totalWeight = emptyWeight;
  let totalMoment = emptyWeight * emptyArm;

  for (const item of payloadItems) {
    totalWeight += item.weight;
    totalMoment += item.weight * item.arm;
  }

  if (totalWeight === 0) return 0;
  return totalMoment / totalWeight;
}

export function calculateMAC(cg: number, trim: TrimConfig): number {
  if (trim.macLength === 0) return 0;
  return ((cg - trim.lemac) / trim.macLength) * 100;
}