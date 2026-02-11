import { LOCAL_TIPS } from "../constants";
import { FoodPlanItem } from "../types";

const getRandomLocalTip = (): string => {
  return LOCAL_TIPS[Math.floor(Math.random() * LOCAL_TIPS.length)];
};

export const getDailyTip = async (): Promise<string> => {
  try {
    const response = await fetch("/api/gemini");
    const data = await response.json();

    if (data.tip) return data.tip;

    return getRandomLocalTip();
  } catch {
    return getRandomLocalTip();
  }
};

export const generateWeeklyFoodPlan = async (): Promise<FoodPlanItem[]> => {
  try {
    const response = await fetch("/api/weekly-plan");
    const data = await response.json();

    if (Array.isArray(data)) {
      return data;
    }

    throw new Error();
  } catch {
    return [
      { day: "Domingo", food: "Iogurte com mel" },
      { day: "Segunda", food: "Banana com aveia" },
      { day: "Terça", food: "Sanduíche de ricota" },
      { day: "Quarta", food: "Mamão com granola" },
      { day: "Quinta", food: "Torrada com requeijão" },
      { day: "Sexta", food: "Suco de maçã com biscoito integral" },
      { day: "Sábado", food: "Pêra com iogurte" },
    ];
  }
};
