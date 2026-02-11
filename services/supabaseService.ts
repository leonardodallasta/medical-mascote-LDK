import { supabase } from '../supabaseClient';
import { Medicine, Log } from "../types";

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