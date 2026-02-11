import React, { useState, useEffect } from 'react';
import { Utensils, Loader2, X, CheckSquare, Square } from 'lucide-react';
import * as gemini from '../services/geminiService';
import * as db from '../services/supabaseService';
import { FoodPlanItem } from '../types';

const FoodPlan: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [plan, setPlan] = useState<FoodPlanItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  // Carregar do Banco ao abrir
  useEffect(() => {
    if (isOpen) {
      loadPlanFromDb();
    }
  }, [isOpen]);

  const loadPlanFromDb = async () => {
    try {
      const data = await db.getWeeklyPlan();
      
      if (data && data.length > 0) {
        // Mapeia para o formato visual
        const formattedPlan = data.map((item: any) => ({
          day: item.day,
          food: item.food
        }));
        
        // Reconstrói o estado dos checks
        const checks: Record<string, boolean> = {};
        data.forEach((item: any) => {
          checks[item.day] = item.is_checked;
        });

        setPlan(formattedPlan);
        setCheckedItems(checks);
      }
    } catch (error) {
      console.error("Erro ao carregar cardápio:", error);
    }
  };

  const handleGenerate = async () => {
      setLoading(true);
      try {
        // 1. Gera com IA
        const newPlan = await gemini.generateWeeklyFoodPlan();
        
        // 2. Salva no Banco (substituindo o antigo)
        await db.saveWeeklyPlan(newPlan);
        
        // 3. Atualiza estado local
        setPlan(newPlan);
        setCheckedItems({}); // Reseta os checks visualmente
      } catch (error) {
        console.error("Erro ao gerar cardápio:", error);
        alert("Erro ao gerar cardápio. Tente novamente.");
      } finally {
        setLoading(false);
      }
  };

  const toggleCheck = async (day: string) => {
      // 1. Atualização Otimista (Muda na hora na tela)
      const newStatus = !checkedItems[day];
      const newChecks = { ...checkedItems, [day]: newStatus };
      setCheckedItems(newChecks);

      // 2. Salva no banco em background
      await db.togglePlanItemCheck(day, newStatus);
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
        <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
            <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
                <X size={24} />
            </button>

            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2 flex-shrink-0">
                <Utensils className="text-primary" />
                O que comer?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-shrink-0">
                Sugestões do mascote para proteger seu estômago.
            </p>

            {/* Estado Vazio */}
            {plan.length === 0 && !loading && (
                <div className="text-center py-8 flex-grow flex flex-col justify-center">
                    <p className="text-gray-500 mb-4">Ainda não geramos seu cardápio dessa semana.</p>
                    <button 
                        onClick={handleGenerate}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
                    >
                        Gerar Cardápio com IA
                    </button>
                </div>
            )}

            {/* Carregando */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-12 text-primary flex-grow">
                    <Loader2 className="animate-spin mb-2" size={32} />
                    <p>O mascote está pensando...</p>
                </div>
            )}

            {/* Lista do Cardápio */}
            {plan.length > 0 && !loading && (
                <div className="flex-grow overflow-y-auto pr-2 min-h-0">
                    <div className="space-y-3 pb-4">
                        {plan.map((item, idx) => {
                            const isChecked = checkedItems[item.day] || false;
                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => toggleCheck(item.day)}
                                    className={`
                                        flex justify-between items-center p-3 rounded-lg border cursor-pointer transition-all select-none
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
                </div>
            )}

            {/* Botão de Regenerar (Fixo embaixo se tiver lista) */}
            {plan.length > 0 && !loading && (
                 <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
                    <button 
                        onClick={() => {
                            if(confirm("Deseja gerar um novo cardápio? O atual será perdido.")) {
                                handleGenerate();
                            }
                        }}
                        className="w-full py-2 text-sm text-gray-400 hover:text-primary transition-colors underline"
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