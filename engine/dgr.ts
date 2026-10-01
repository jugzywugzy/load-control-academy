export interface DGItem {
  id: string;
  weight: number;
  dgClass: 'NONE' | '3' | '5.1' | '1'; // 3: Flammable, 5.1: Oxidizer, 1: Explosive
  description: string;
}

export function validateSegregation(existingHoldItems: DGItem[], incomingItem: DGItem): { valid: boolean; error?: string } {
  if (incomingItem.dgClass === 'NONE') return { valid: true };

  // IATA Segregation Matrix (Simplified for Training)
  const incompatibilities: Record<string, string[]> = {
    '3': ['5.1', '1'], // Flammable liquids cannot mix with Oxidizers or Explosives
    '5.1': ['3', '1'], // Oxidizers cannot mix with Flammables or Explosives
    '1': ['3', '5.1'], // Explosives cannot mix with Flammables or Oxidizers
  };

  for (const item of existingHoldItems) {
    if (item.dgClass !== 'NONE' && incompatibilities[incomingItem.dgClass]?.includes(item.dgClass)) {
      return { 
        valid: false, 
        error: `DGR VIOLATION: Cannot load Class ${incomingItem.dgClass} (${incomingItem.description}) next to Class ${item.dgClass} (${item.description}) in the same hold.` 
      };
    }
  }
  return { valid: true };
}