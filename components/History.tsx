import React from 'react';
import { Log, Medicine } from '../types';
import { Check, X, Clock, Eye } from 'lucide-react';

interface HistoryProps {
  logs: Log[];
  medicines: Medicine[];
  onTakeLate: (date: Date) => void;
  onOpenFullHistory: () => void;
}

const History: React.FC<HistoryProps> = ({ logs, medicines, onTakeLate, onOpenFullHistory }) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0,0,0,0);
    return d;
  });

  const getStatusForDay = (date: Date) => {
    const dayOfWeek = date.getDay();
    const requiredMeds = medicines.filter(m => m.daysOfWeek.includes(dayOfWeek));

    if (requiredMeds.length === 0) return 'none'; 

    const dayLogs = logs.filter(l => {
        const ld = new Date(l.takenAt);
        ld.setHours(0,0,0,0);
        return ld.getTime() === date.getTime();
    });

    const allTaken = requiredMeds.every(m => dayLogs.some(l => l.medicineId === m.id));
    
    if (allTaken) {
        const hasLate = dayLogs.some(l => l.status === 'late');
        return hasLate ? 'late' : 'taken';
    }
    
    const isToday = new Date().setHours(0,0,0,0) === date.getTime();
    if (isToday) return 'pending';

    return 'missed';
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4 transition-colors">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Histórico Semanal</h3>
        <button 
          onClick={onOpenFullHistory}
          className="p-2 text-primary bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-full transition-colors flex-shrink-0"
          title="Ver histórico completo"
        >
          <Eye size={20} />
        </button>
      </div>
      
      <div className="flex justify-between items-center overflow-x-auto pb-2 gap-2">
        {days.map((day, idx) => {
          const status = getStatusForDay(day);
          const isToday = idx === 6;
          const dayName = day.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
          const dayNum = day.getDate();

          let bgColor = '';
          let icon = null;

          switch(status) {
              case 'taken':
                  bgColor = 'bg-success/10 border-success text-success dark:bg-green-900/30 dark:text-green-400';
                  icon = <Check size={20} />;
                  break;
              case 'late':
                  bgColor = 'bg-warning/20 border-warning text-yellow-600 dark:text-yellow-400';
                  icon = <Clock size={20} />;
                  break;
              case 'missed':
                  bgColor = 'bg-red-50 border-danger/30 text-danger/50 dark:bg-red-900/20 cursor-pointer hover:bg-red-100';
                  icon = <X size={16} />;
                  break;
              case 'pending':
                  bgColor = 'bg-gray-50 border-gray-200 text-gray-300 dark:bg-gray-700 dark:border-gray-600';
                  icon = <span className="text-xs font-bold">{dayNum}</span>;
                  break;
              default:
                  bgColor = 'bg-gray-50 border-transparent text-gray-200 dark:bg-gray-800 dark:text-gray-700';
                  icon = <span className="text-xs">-</span>;
          }

          return (
            <div key={idx} className="flex flex-col items-center gap-1 min-w-[3rem] flex-shrink-0">
              <span className={`text-xs font-semibold uppercase ${isToday ? 'text-primary' : 'text-gray-400'}`}>
                {dayName}
              </span>
              <button 
                onClick={() => status === 'missed' ? onTakeLate(day) : null}
                disabled={status !== 'missed'}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0
                  ${bgColor}
                `}
                title={status === 'missed' ? "Marcar como tomado atrasado" : ""}
              >
                {icon}
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap justify-end gap-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-success flex-shrink-0"></div> Em dia</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-warning flex-shrink-0"></div> Atrasado</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-danger flex-shrink-0"></div> Perdeu</span>
      </div>
    </div>
  );
};

export default History;