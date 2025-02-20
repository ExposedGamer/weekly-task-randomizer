
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

  const generateDailySchedule = useCallback(() => {
    const slots: TimeSlot[] = [
      { start: '08:00', end: '12:00', task: WORK_TASK, isFixed: true },
      { start: '12:00', end: '13:00', task: tasks[Math.floor(Math.random() * tasks.length)], isFixed: false },
      { start: '13:00', end: '18:00', task: WORK_TASK, isFixed: true },
    ];

    // Add evening slots
    for (let hour = 18; hour < 24; hour++) {
      slots.push({
        start: `${hour}:00`,
        end: `${hour + 1}:00`,
        task: tasks[Math.floor(Math.random() * tasks.length)],
        isFixed: false,
      });
    }

    return slots;
  }, [tasks]);

  const generateWeekSchedule = useCallback(() => {
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const newSchedule: Record<string, TimeSlot[]> = {};
    
    days.forEach(day => {
      newSchedule[day] = generateDailySchedule();
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

  return {
    tasks,
    schedule,
    updateTasks,
    generateWeekSchedule,
    toggleTaskCompletion,
  };
};
