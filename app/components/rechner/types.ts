export type InsuranceFor = 'self' | 'child' | 'spouse' | 'partner' | '';
export type Gender = 'Männlich' | 'Weiblich' | '';

export interface RechnerData {
  step: number;
  insuranceFor: InsuranceFor;
  gender: Gender;
  sport: string;
  frequency: string;
  birthDate: string;
  name: string;
  email: string;
  phone: string;
  completedAt: string | null;
  lastUpdated: string;
}

export interface TariffInfo {
  title: 'Small' | 'Medium' | 'Large' | 'Small Kids' | 'Medium Kids' | 'Large Kids';
  price: string;
  features: readonly string[];
}

export interface SportOption {
  name: string;
  icon: string;
  image: string;
  catch: string;
}

export interface RechnerContextType {
  data: RechnerData;
  updateData: (updates: Partial<RechnerData>) => void;
  nextStep: () => void;
  goToStep: (step: number) => void;
  resetRechner: () => void;
  saveData: (updates?: Partial<RechnerData>) => void;
  isLoading: boolean;
}
