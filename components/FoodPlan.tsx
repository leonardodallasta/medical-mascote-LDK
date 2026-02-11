import React, { useState, useEffect } from 'react';
import { Utensils, Loader2, X, CheckSquare, Square } from 'lucide-react';
import * as gemini from '../services/geminiService';
import { FoodPlanItem } from '../types';

const FoodPlan: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [plan, setPlan] = useState<FoodPlanItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedPlan = localStorage.getItem('medipal_food_plan');
    if (savedPlan) {
        setPlan(JSON.parse(savedPlan));
    }
    const savedChecks = localStorage.getItem('medipal_food_checks');
    if (savedChecks) {
        setCheckedItems(JSON.parse(savedChecks));
    }
  }, []);

  const handleGenerate = async () => {
      setLoading(true);
      const newPlan = await gemini.generateWeeklyFoodPlan();
      setPlan(newPlan);
      localStorage.setItem('medipal_food_plan', JSON.stringify(newPlan));
      // Reset checks on new plan
      setCheckedItems({});
      localStorage.setItem('medipal_food_checks', JSON.stringify({}));
      setLoading(false);
  };

  const toggleCheck = (day: string) => {
      const newChecks = { ...checkedItems, [day]: !checkedItems[day] };
      setCheckedItems(newChecks);
      localStorage.setItem('medipal_food_checks', JSON.stringify(newChecks));
  };

  if (!isOpen) {
      return (
          <button 
            onClick={() => setIsOpen(true)}
            className="w-full mt-4 py-3 bg-white dark:bg-gray-800 border border-primary/20 text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
          >
              <Utensils size={20} />
              Ver Cardápio Semanal
          </button>
      );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
                <X size={24} />
            </button>

            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                <Utensils className="text-primary" />
                O que comer?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Sugestões do mascote para proteger seu estômago. Marque o que você já separou!
            </p>

            {plan.length === 0 && !loading && (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Ainda não geramos seu cardápio dessa semana.</p>
                    <button 
                        onClick={handleGenerate}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
                    >
                        Gerar Cardápio
                    </button>
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center py-12 text-primary">
                    <Loader2 className="animate-spin mb-2" size={32} />
                    <p>O mascote está pensando...</p>
                </div>
            )}

            {plan.length > 0 && !loading && (
                <div className="max-h-[60vh] overflow-y-auto pr-2">
                    <div className="space-y-3">
                        {plan.map((item, idx) => {
                            const isChecked = checkedItems[item.day] || false;
                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => toggleCheck(item.day)}
                                    className={`
                                        flex justify-between items-center p-3 rounded-lg border cursor-pointer transition-all
                                        ${isChecked 
                                            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                                            : 'bg-gray-50 border-gray-100 dark:bg-gray-700/50 dark:border-gray-700'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`
                                            ${isChecked ? 'text-green-600 dark:text-green-400' : 'text-gray-300 dark:text-gray-500'}
                                        `}>
                                            {isChecked ? <CheckSquare size={20} /> : <Square size={20} />}
                                        </div>
                                        <div>
                                            <span className={`block text-xs font-bold uppercase ${isChecked ? 'text-green-700 dark:text-green-300' : 'text-primary dark:text-blue-400'}`}>
                                                {item.day}
                                            </span>
                                            <span className={`text-sm ${isChecked ? 'text-green-800 dark:text-green-100 line-through opacity-70' : 'text-gray-700 dark:text-gray-200'}`}>
                                                {item.food}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <button 
                        onClick={handleGenerate}
                        className="w-full mt-6 py-2 text-sm text-gray-400 hover:text-primary transition-colors underline"
                    >
                        Gerar novas sugestões
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default FoodPlan;