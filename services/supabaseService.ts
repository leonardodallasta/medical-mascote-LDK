import { supabase } from '../supabaseClient';
import { Medicine, Log, FoodPlanItem } from "../types";

// --- MEDICINES (Seu código original mantido) ---

export const saveMedicine = async (medicine: Medicine): Promise<void> => {
  const { error } = await supabase
    .from('medicines')
    .upsert({
      id: medicine.id,
      name: medicine.name,
      reason: medicine.reason,
      time: medicine.time,
      days_of_week: medicine.daysOfWeek,
      created_at: medicine.createdAt
    });

  if (error) {
    console.error('Error saving medicine:', error);
    throw error;
  }
};

export const getMedicines = async (): Promise<Medicine[]> => {
  const { data, error } = await supabase
    .from('medicines')
    .select('*');

  if (error) {
    console.error('Error fetching medicines:', error);
    return [];
  }

  return data.map((m: any) => ({
    id: m.id,
    name: m.name,
    reason: m.reason,
    time: m.time,
    daysOfWeek: m.days_of_week,
    createdAt: m.created_at
  }));
};

export const deleteMedicine = async (id: string): Promise<void> => {
  // Cascade delete handles logs usually, but we delete explicitly to be safe if cascade isn't set up
  await supabase.from('logs').delete().eq('medicine_id', id);
  const { error } = await supabase.from('medicines').delete().eq('id', id);

  if (error) {
    console.error('Error deleting medicine:', error);
    throw error;
  }
};

// --- LOGS (Seu código original mantido) ---

export const saveLog = async (log: Log): Promise<void> => {
  const { error } = await supabase
    .from('logs')
    .insert({
      id: log.id,
      medicine_id: log.medicineId,
      taken_at: log.takenAt,
      status: log.status
    });

  if (error) {
    console.error('Error saving log:', error);
    throw error;
  }
};

export const getLogs = async (): Promise<Log[]> => {
  const { data, error } = await supabase
    .from('logs')
    .select('*');

  if (error) {
    console.error('Error fetching logs:', error);
    return [];
  }

  return data.map((l: any) => ({
    id: l.id,
    medicineId: l.medicine_id,
    takenAt: l.taken_at,
    status: l.status
  }));
};

// --- FOOD PLAN (NOVO - Cardápio Semanal) ---

// Interface auxiliar para o retorno do banco (combina o item do cardápio + status do check)
export interface FoodPlanWithStatus extends FoodPlanItem {
  is_checked: boolean;
}

export const getWeeklyPlan = async (): Promise<FoodPlanWithStatus[]> => {
  const { data, error } = await supabase
    .from('weekly_plan')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching food plan:', error);
    return [];
  }

  // Mapeia o retorno do banco para o tipo estendido
  return data.map((item: any) => ({
    day: item.day,
    food: item.food,
    is_checked: item.is_checked
  }));
};

export const saveWeeklyPlan = async (plan: FoodPlanItem[]): Promise<void> => {
  // 1. Limpa o plano anterior para evitar duplicidade
  // Usamos .neq('id', '0...') como hack seguro para deletar tudo sem filtro específico
  const { error: deleteError } = await supabase
    .from('weekly_plan')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); 

  if (deleteError) {
    console.error('Error clearing old plan:', deleteError);
    throw deleteError;
  }

  // 2. Insere o novo plano gerado pela IA (começando tudo desmarcado)
  const rows = plan.map(item => ({
    day: item.day,
    food: item.food,
    is_checked: false
  }));

  const { error } = await supabase
    .from('weekly_plan')
    .insert(rows);

  if (error) {
    console.error('Error saving new food plan:', error);
    throw error;
  }
};

export const togglePlanItemCheck = async (day: string, isChecked: boolean): Promise<void> => {
  const { error } = await supabase
    .from('weekly_plan')
    .update({ is_checked: isChecked })
    .eq('day', day);

  if (error) {
    console.error('Error updating check status:', error);
    // Não lançamos erro aqui para não travar a UI, apenas logamos
  }
};