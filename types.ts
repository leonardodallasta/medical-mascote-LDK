export interface Medicine {
  id: string;
  name: string;
  reason: string;
  time: string;
  daysOfWeek: number[];
  createdAt: number;
}

export interface Log {
  id: string;
  medicineId: string;
  takenAt: number; // timestamp
  status: 'taken' | 'skipped' | 'late';
}

export interface FoodPlanItem {
  day: string;
  food: string;
}

export enum MascotStatus {
  HAPPY = 'happy',       // 0 missed days
  CONCERNED = 'concerned', // 1 missed day
  SICK = 'sick',         // 2-3 missed days
  VERY_SICK = 'very_sick', // 4-6 missed days
  CRITICAL = 'critical',  // 6 missed days
  DEAD = 'dead'          // 7+ missed days
}

export interface DailyTip {
  text: string;
  source: 'local' | 'gemini';
}