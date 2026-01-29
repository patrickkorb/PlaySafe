// Utility functions for tracking Datafast goals

// Send goal event to Datafast via API route
export async function trackDatafastGoal(
  goalName: string,
  metadata?: Record<string, string>
): Promise<void> {
  try {
    await fetch('/api/datafast-goal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goalName,
        metadata,
      }),
    });
  } catch (error) {
    console.error('Error tracking Datafast goal:', error);
  }
}

// Specific goal tracking functions
export const trackEnterBirthDate = async (birthDate?: string) => {
  return await trackDatafastGoal('enter_birth_date', {
    birth_date: birthDate || '',
  });
};

export const trackSportSelected = async (sport?: string) => {
  return await trackDatafastGoal('select_sport', {
    sport: sport || '',
  });
};

export const trackFrequencySelected = async (frequency?: string) => {
  return await trackDatafastGoal('select_frequency', {
    frequency: frequency || '',
  });
};

export const trackCalculatorComplete = async (
  sport?: string,
  frequency?: string,
  tariff?: string
) => {
  return await trackDatafastGoal('calculator_complete', {
    sport: sport || '',
    frequency: frequency || '',
    tariff: tariff || '',
  });
};

// Fußball-specific tracking functions
export const trackGenderSelected = async (gender?: string) => {
  return await trackDatafastGoal('select_gender', {
    gender: gender || '',
  });
};

export const trackInsuranceStatusSelected = async (hasInsurance?: string) => {
  return await trackDatafastGoal('select_insurance_status', {
    has_insurance: hasInsurance || '',
  });
};

export const trackInjuryStatusSelected = async (hasInjury?: string) => {
  return await trackDatafastGoal('select_injury_status', {
    has_injury: hasInjury || '',
  });
};

// Rechner-specific tracking functions
export const trackContactDataSubmitted = async (
  name?: string,
  email?: string,
  phone?: string
) => {
  return await trackDatafastGoal('contact_data_submitted', {
    name: name || '',
    email: email || '',
    phone: phone || '',
  });
};

export const trackOfferPageVisited = async (tariff?: string) => {
  return await trackDatafastGoal('offer_page_visited', {
    tariff: tariff || '',
  });
};

export const trackOfferFormSubmitted = async (
  name?: string,
  email?: string,
  tariff?: string
) => {
  return await trackDatafastGoal('offer_form_submitted', {
    name: name || '',
    email: email || '',
    tariff: tariff || '',
  });
};

// Angebot Step Tracking - für detaillierte Funnel-Analyse
export const trackOfferStep1Completed = async (
  insuranceFor?: string,
  tariff?: string
) => {
  return await trackDatafastGoal('offer_step1_completed', {
    insurance_for: insuranceFor || '',
    tariff: tariff || '',
  });
};

export const trackOfferStep2Completed = async (
  email?: string,
  tariff?: string
) => {
  return await trackDatafastGoal('offer_step2_completed', {
    email: email || '',
    tariff: tariff || '',
  });
};

export const trackOfferStep3Completed = async (
  tariff?: string
) => {
  return await trackDatafastGoal('offer_step3_completed', {
    tariff: tariff || '',
  });
};
