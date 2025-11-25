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
