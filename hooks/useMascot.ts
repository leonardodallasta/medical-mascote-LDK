import { useState, useEffect } from 'react';
import { Log, MascotStatus, Medicine } from '../types';

/**
 * Hook responsável por calcular o estado do mascote
 * com base no histórico de medicamentos cadastrados
 * e nos registros de tomada.
 *
 * @param medicines Lista de medicamentos cadastrados
 * @param logs Lista de registros de medicamentos tomados
 * @returns Objeto contendo o status atual do mascote e a streak ativa
 */
export const useMascot = (medicines: Medicine[], logs: Log[]) => {
  const [status, setStatus] = useState<MascotStatus>(MascotStatus.HAPPY);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    calculateState();
  }, [medicines, logs]);

  /**
   * Calcula o estado atual do mascote considerando:
   * - Dias consecutivos perdidos
   * - Sequência de dias tomados
   * - Atraso superior a 1 hora no dia atual
   */
  const calculateState = () => {
    if (medicines.length === 0) {
      setStatus(MascotStatus.HAPPY);
      setStreak(0);
      return;
    }

    const today = normalizeDate(new Date());

    const oldestMedicineDate = normalizeDate(
      new Date(
        Math.min(...medicines.map(m => new Date(m.createdAt).getTime()))
      )
    );

    let consecutiveMissedDays = 0;
    let streakDays = 0;

    let countingMisses = true;
    let countingStreak = true;

    let checkDate = new Date(today);

    for (let i = 0; i < 30; i++) {
      if (checkDate < oldestMedicineDate) break;

      const requiredMeds = getRequiredMedicinesForDate(checkDate);

      if (requiredMeds.length > 0) {
        const allTaken = areAllMedicinesTakenOnDate(requiredMeds, checkDate);

        if (allTaken) {
          if (countingStreak) streakDays++;
          countingMisses = false;
        } else {
          countingStreak = false;

          if (i !== 0 && countingMisses) {
            consecutiveMissedDays++;
          }
        }
      }

      checkDate.setDate(checkDate.getDate() - 1);
    }

    setStreak(streakDays);

    let newStatus = getStatusFromMissedDays(consecutiveMissedDays);

    if (newStatus === MascotStatus.HAPPY && isLateToday(today)) {
      newStatus = MascotStatus.CONCERNED;
    }

    setStatus(newStatus);
  };

  /**
   * Normaliza uma data zerando horas, minutos e segundos
   */
  const normalizeDate = (date: Date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  /**
   * Retorna os medicamentos que devem ser tomados
   * em uma determinada data
   */
  const getRequiredMedicinesForDate = (date: Date) => {
    const dayOfWeek = date.getDay();
    return medicines.filter(m => m.daysOfWeek.includes(dayOfWeek));
  };

  /**
   * Verifica se todos os medicamentos obrigatórios
   * foram tomados em uma determinada data
   */
  const areAllMedicinesTakenOnDate = (
    requiredMeds: Medicine[],
    date: Date
  ) => {
    const timestamp = normalizeDate(date).getTime();

    return requiredMeds.every(med =>
      logs.some(log => {
        const logDate = normalizeDate(new Date(log.takenAt));
        return (
          log.medicineId === med.id &&
          logDate.getTime() === timestamp
        );
      })
    );
  };

  /**
   * Determina o status do mascote com base
   * na quantidade de dias consecutivos perdidos
   */
  const getStatusFromMissedDays = (missedDays: number): MascotStatus => {
    if (missedDays === 0) return MascotStatus.HAPPY;
    if (missedDays === 1) return MascotStatus.CONCERNED;
    if (missedDays <= 3) return MascotStatus.SICK;
    if (missedDays <= 5) return MascotStatus.VERY_SICK;
    if (missedDays === 6) return MascotStatus.CRITICAL;
    return MascotStatus.DEAD;
  };

  /**
   * Verifica se há atraso superior a 1 hora
   * para algum medicamento obrigatório no dia atual
   */
  const isLateToday = (today: Date) => {
    const now = new Date();
    const todaysMeds = getRequiredMedicinesForDate(today);

    if (todaysMeds.length === 0) return false;

    const allTakenToday = areAllMedicinesTakenOnDate(todaysMeds, today);
    if (allTakenToday) return false;

    const oneHour = 60 * 60 * 1000;

    return todaysMeds.some(med => {
      const [hour, minute] = med.time.split(':').map(Number);
      const scheduled = new Date(today);
      scheduled.setHours(hour, minute, 0, 0);

      return now.getTime() - scheduled.getTime() > oneHour;
    });
  };

  return { status, streak };
};
