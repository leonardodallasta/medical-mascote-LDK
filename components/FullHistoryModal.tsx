import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Check, Clock } from 'lucide-react';
import { Log, Medicine } from '../types';

interface FullHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: Log[];
  medicines: Medicine[];
}

const FullHistoryModal: React.FC<FullHistoryModalProps> = ({ isOpen, onClose, logs, medicines }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());

  if (!isOpen) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Create array for grid
  const daysArray = [];
  for (let i = 0; i < firstDayOfMonth; i++) daysArray.push(null);
  for (let i = 1; i <= daysInMonth; i++) daysArray.push(new Date(year, month, i));

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
    setSelectedDay(null); // Clear selection when changing month
  };

  const getDayStatus = (date: Date) => {
      const dayOfWeek = date.getDay();
      const dateStr = date.toDateString();
      
      const requiredMeds = medicines.filter(m => m.daysOfWeek.includes(dayOfWeek));
      if (requiredMeds.length === 0) return 'none';

      const dayLogs = logs.filter(l => new Date(l.takenAt).toDateString() === dateStr);
      
      const allTaken = requiredMeds.every(m => dayLogs.some(l => l.medicineId === m.id));
      
      if (allTaken) return 'taken';
      
      // Check if it's in the past and missed
      const today = new Date();
      today.setHours(0,0,0,0);
      if (date < today && !allTaken) return 'missed';
      
      return 'pending';
  };

  const getLogsForSelectedDay = () => {
      if (!selectedDay) return [];
      return logs.filter(l => {
          return new Date(l.takenAt).toDateString() === selectedDay.toDateString();
      }).sort((a,b) => a.takenAt - b.takenAt);
  };

  const selectedDayLogs = getLogsForSelectedDay();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
        >
            <X size={24} />
        </button>

        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <Calendar className="text-primary" />
            Histórico Detalhado
        </h3>

        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-4">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <ChevronLeft size={24} className="text-gray-600 dark:text-gray-300"/>
            </button>
            <span className="text-lg font-bold text-gray-800 dark:text-white capitalize">
                {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <ChevronRight size={24} className="text-gray-600 dark:text-gray-300"/>
            </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-6">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                <div key={i} className="text-center text-xs font-bold text-gray-400 mb-2">{d}</div>
            ))}
            {daysArray.map((date, idx) => {
                if (!date) return <div key={idx}></div>;
                
                const status = getDayStatus(date);
                const isSelected = selectedDay && date.toDateString() === selectedDay.toDateString();
                const isToday = date.toDateString() === new Date().toDateString();

                let bgClass = 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
                if (status === 'taken') bgClass = 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-bold';
                if (status === 'missed') bgClass = 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300';
                if (isSelected) bgClass += ' ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800';

                return (
                    <button 
                        key={idx}
                        onClick={() => setSelectedDay(date)}
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all mx-auto ${bgClass}`}
                    >
                        {date.getDate()}
                    </button>
                );
            })}
        </div>

        {/* Details Section */}
        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
            <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3">
                {selectedDay 
                    ? `Detalhes de ${selectedDay.toLocaleDateString('pt-BR')}`
                    : 'Selecione um dia'
                }
            </h4>
            
            {selectedDay && selectedDayLogs.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Nenhum registro encontrado para este dia.</p>
            ) : (
                <div className="space-y-2">
                    {selectedDayLogs.map(log => {
                        const med = medicines.find(m => m.id === log.medicineId);
                        const time = new Date(log.takenAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                        return (
                            <div key={log.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    {log.status === 'late' ? <Clock size={16} className="text-yellow-500" /> : <Check size={16} className="text-green-500" />}
                                    <span className="font-medium text-gray-800 dark:text-white">{med?.name || 'Remédio Excluído'}</span>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {log.status === 'late' ? 'Com atraso às' : 'Tomado às'} {time}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default FullHistoryModal;