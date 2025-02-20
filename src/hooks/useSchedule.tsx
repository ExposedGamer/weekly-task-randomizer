
import { useState, useCallback } from 'react';

export type Task = {
  id: string;
  name: string;
  completed: boolean;
};

export type TimeSlot = {
  start: string;
  end: string;
  task: Task | null;
  isFixed: boolean;
};

export type CustomSchedule = {
  [day: string]: {
    start: string;
    end: string;
  }[];
};

const DEFAULT_TASKS = [
  { id: '1', name: 'Assistir Harry Potter', completed: false },
  { id: '2', name: 'Assistir aula do curso', completed: false },
  { id: '3', name: 'Assistir Garota de Fora', completed: false },
  { id: '4', name: 'Assistir Dorama Novo', completed: false },
  { id: '5', name: 'Jogar Jogo lista', completed: false },
];

const WORK_TASK = { id: 'work', name: 'Trabalho', completed: false };

export const useSchedule = () => {
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [schedule, setSchedule] = useState<Record<string, TimeSlot[]>>({});
  const [customTimeSlots, setCustomTimeSlots] = useState<CustomSchedule>({});

  const generateDailySchedule = useCallback((day: string) => {
    let slots: TimeSlot[] = [];
    const dayCustomSlots = customTimeSlots[day] || [];

    if (dayCustomSlots.length > 0) {
      // Use custom time slots if available
      slots = dayCustomSlots.map(slot => {
        // Verificar se é um horário de trabalho baseado no dia e horário
        const isWorkTime = 
          (day !== 'Domingo' && day !== 'Sábado' && 
           ((slot.start >= '08:00' && slot.end <= '12:00') || 
            (slot.start >= '13:00' && slot.end <= '18:00'))) ||
          (day === 'Sábado' && slot.start >= '09:00' && slot.end <= '13:00');

        return {
          start: slot.start,
          end: slot.end,
          task: isWorkTime ? WORK_TASK : tasks[Math.floor(Math.random() * tasks.length)],
          isFixed: isWorkTime,
        };
      });
    } else if (day === 'Domingo') {
      // Domingo: sem trabalho, começa às 10h, almoço 12h-14h
      slots = [
        { start: '10:00', end: '12:00', task: tasks[Math.floor(Math.random() * tasks.length)], isFixed: false },
        { start: '12:00', end: '14:00', task: tasks[Math.floor(Math.random() * tasks.length)], isFixed: false },
      ];
      
      // Adiciona slots da tarde/noite
      for (let hour = 14; hour < 24; hour++) {
        slots.push({
          start: `${hour}:00`,
          end: `${hour + 1}:00`,
          task: tasks[Math.floor(Math.random() * tasks.length)],
          isFixed: false,
        });
      }
    } else if (day === 'Sábado') {
      // Sábado: trabalho 9h-13h
      slots = [
        { start: '09:00', end: '13:00', task: WORK_TASK, isFixed: true },
        { start: '13:00', end: '14:00', task: tasks[Math.floor(Math.random() * tasks.length)], isFixed: false },
      ];
      
      // Adiciona slots da tarde/noite
      for (let hour = 14; hour < 24; hour++) {
        slots.push({
          start: `${hour}:00`,
          end: `${hour + 1}:00`,
          task: tasks[Math.floor(Math.random() * tasks.length)],
          isFixed: false,
        });
      }
    } else {
      // Dias de semana: trabalho 8h-12h e 13h-18h
      slots = [
        { start: '08:00', end: '12:00', task: WORK_TASK, isFixed: true },
        { start: '12:00', end: '13:00', task: tasks[Math.floor(Math.random() * tasks.length)], isFixed: false },
        { start: '13:00', end: '18:00', task: WORK_TASK, isFixed: true },
      ];
      
      // Adiciona slots da noite
      for (let hour = 18; hour < 24; hour++) {
        slots.push({
          start: `${hour}:00`,
          end: `${hour + 1}:00`,
          task: tasks[Math.floor(Math.random() * tasks.length)],
          isFixed: false,
        });
      }
    }

    return slots;
  }, [tasks, customTimeSlots]);

  const generateWeekSchedule = useCallback(() => {
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const newSchedule: Record<string, TimeSlot[]> = {};
    
    days.forEach(day => {
      newSchedule[day] = generateDailySchedule(day);
    });

    setSchedule(newSchedule);
  }, [generateDailySchedule]);

  const toggleTaskCompletion = useCallback((day: string, slotIndex: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].map((slot, idx) => 
        idx === slotIndex && slot.task
          ? { ...slot, task: { ...slot.task, completed: !slot.task.completed } }
          : slot
      ),
    }));
  }, []);

  const updateTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
  }, []);

  const updateDaySchedule = useCallback((day: string, newSlots: { start: string; end: string }[]) => {
    setCustomTimeSlots(prev => ({
      ...prev,
      [day]: newSlots,
    }));
  }, []);

  return {
    tasks,
    schedule,
    updateTasks,
    generateWeekSchedule,
    toggleTaskCompletion,
    updateDaySchedule,
  };
};
