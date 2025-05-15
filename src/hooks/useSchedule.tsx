import { useState, useCallback, useEffect } from 'react';

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
  isBlocked: boolean; // Property to track blocked slots
};

export type CustomSchedule = {
  [day: string]: {
    start: string;
    end: string;
  }[];
};

export type WeekHistory = {
  id: string;
  date: string;
  schedule: Record<string, TimeSlot[]>;
  completedTasks: number;
  totalTasks: number;
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
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : DEFAULT_TASKS;
  });
  
  const [schedule, setSchedule] = useState<Record<string, TimeSlot[]>>(() => {
    const savedSchedule = localStorage.getItem('schedule');
    return savedSchedule ? JSON.parse(savedSchedule) : {};
  });
  
  const [customTimeSlots, setCustomTimeSlots] = useState<CustomSchedule>(() => {
    const savedCustomSlots = localStorage.getItem('customTimeSlots');
    return savedCustomSlots ? JSON.parse(savedCustomSlots) : {};
  });

  const [weekHistory, setWeekHistory] = useState<WeekHistory[]>(() => {
    const savedHistory = localStorage.getItem('weekHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('customTimeSlots', JSON.stringify(customTimeSlots));
  }, [customTimeSlots]);

  useEffect(() => {
    localStorage.setItem('weekHistory', JSON.stringify(weekHistory));
  }, [weekHistory]);

  const generateDailySchedule = useCallback((day: string) => {
    let slots: TimeSlot[] = [];
    const dayCustomSlots = customTimeSlots[day] || [];
    const currentDaySchedule = schedule[day] || [];

    // Find all blocked slots from the current schedule
    const blockedSlots = currentDaySchedule.filter(slot => slot.isBlocked);

    if (dayCustomSlots.length > 0) {
      slots = dayCustomSlots.map(slot => {
        // Check if this time slot was blocked in the previous schedule
        const existingSlot = blockedSlots.find(
          blocked => blocked.start === slot.start && blocked.end === slot.end
        );
        
        const isWorkTime = 
          (day !== 'Domingo' && day !== 'Sábado' && 
           ((slot.start >= '08:00' && slot.end <= '12:00') || 
            (slot.start >= '13:00' && slot.end <= '18:00'))) ||
          (day === 'Sábado' && slot.start >= '09:00' && slot.end <= '13:00');

        // If the slot was blocked previously, keep its task
        if (existingSlot) {
          return {
            start: slot.start,
            end: slot.end,
            task: existingSlot.task,
            isFixed: true,
            isBlocked: true,
          };
        }

        return {
          start: slot.start,
          end: slot.end,
          task: isWorkTime ? WORK_TASK : tasks[Math.floor(Math.random() * tasks.length)],
          isFixed: isWorkTime,
          isBlocked: false,
        };
      });
    } else if (day === 'Domingo') {
      slots = [
        { start: '10:00', end: '12:00', task: tasks[Math.floor(Math.random() * tasks.length)], isFixed: false, isBlocked: false },
        { start: '12:00', end: '14:00', task: tasks[Math.floor(Math.random() * tasks.length)], isFixed: false, isBlocked: false },
      ];
      
      for (let hour = 14; hour < 24; hour++) {
        // Check if this time slot was blocked in the previous schedule
        const existingSlot = blockedSlots.find(
          slot => slot.start === `${hour}:00` && slot.end === `${hour + 1}:00`
        );

        if (existingSlot) {
          slots.push({
            start: existingSlot.start,
            end: existingSlot.end,
            task: existingSlot.task,
            isFixed: true,
            isBlocked: true,
          });
        } else {
          slots.push({
            start: `${hour}:00`,
            end: `${hour + 1}:00`,
            task: tasks[Math.floor(Math.random() * tasks.length)],
            isFixed: false,
            isBlocked: false,
          });
        }
      }
    } else if (day === 'Sábado') {
      slots = [
        { start: '09:00', end: '13:00', task: WORK_TASK, isFixed: true, isBlocked: false },
        { start: '13:00', end: '14:00', task: tasks[Math.floor(Math.random() * tasks.length)], isFixed: false, isBlocked: false },
      ];
      
      for (let hour = 14; hour < 24; hour++) {
        // Check if this time slot was blocked in the previous schedule
        const existingSlot = blockedSlots.find(
          slot => slot.start === `${hour}:00` && slot.end === `${hour + 1}:00`
        );

        if (existingSlot) {
          slots.push({
            start: existingSlot.start,
            end: existingSlot.end,
            task: existingSlot.task,
            isFixed: true,
            isBlocked: true,
          });
        } else {
          slots.push({
            start: `${hour}:00`,
            end: `${hour + 1}:00`,
            task: tasks[Math.floor(Math.random() * tasks.length)],
            isFixed: false,
            isBlocked: false,
          });
        }
      }
    } else {
      slots = [
        { start: '08:00', end: '12:00', task: WORK_TASK, isFixed: true, isBlocked: false },
        { start: '12:00', end: '13:00', task: tasks[Math.floor(Math.random() * tasks.length)], isFixed: false, isBlocked: false },
        { start: '13:00', end: '18:00', task: WORK_TASK, isFixed: true, isBlocked: false },
      ];
      
      for (let hour = 18; hour < 24; hour++) {
        // Check if this time slot was blocked in the previous schedule
        const existingSlot = blockedSlots.find(
          slot => slot.start === `${hour}:00` && slot.end === `${hour + 1}:00`
        );

        if (existingSlot) {
          slots.push({
            start: existingSlot.start,
            end: existingSlot.end,
            task: existingSlot.task,
            isFixed: true,
            isBlocked: true,
          });
        } else {
          slots.push({
            start: `${hour}:00`,
            end: `${hour + 1}:00`,
            task: tasks[Math.floor(Math.random() * tasks.length)],
            isFixed: false,
            isBlocked: false,
          });
        }
      }
    }

    return slots;
  }, [tasks, customTimeSlots, schedule]);

  const generateWeekSchedule = useCallback(() => {
    // Salvar a semana atual no histórico antes de gerar uma nova
    if (Object.keys(schedule).length > 0) {
      const completedTasks = Object.values(schedule).flat().reduce((acc, slot) => {
        return acc + (slot.task?.completed ? 1 : 0);
      }, 0);

      const totalTasks = Object.values(schedule).flat().length;

      const weekData: WeekHistory = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('pt-BR'),
        schedule: schedule,
        completedTasks,
        totalTasks
      };

      setWeekHistory(prev => [weekData, ...prev]);
    }

    // Gerar nova semana
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const newSchedule: Record<string, TimeSlot[]> = {};
    
    days.forEach(day => {
      newSchedule[day] = generateDailySchedule(day);
    });

    setSchedule(newSchedule);
  }, [generateDailySchedule, schedule]);

  const toggleTaskCompletion = useCallback((day: string, slotIndex: number) => {
    setSchedule(prev => {
      const newSchedule = {
        ...prev,
        [day]: prev[day].map((slot, idx) => 
          idx === slotIndex && slot.task
            ? { ...slot, task: { ...slot.task, completed: !slot.task.completed } }
            : slot
        ),
      };
      return newSchedule;
    });
  }, []);

  const updateTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
  }, []);

  const toggleBlockedSlot = useCallback((day: string, slotIndex: number) => {
    setSchedule(prev => {
      const newSchedule = {
        ...prev,
        [day]: prev[day].map((slot, idx) => 
          idx === slotIndex
            ? { ...slot, isBlocked: !slot.isBlocked, isFixed: !slot.isBlocked || slot.isFixed }
            : slot
        ),
      };
      return newSchedule;
    });
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
    weekHistory,
    updateTasks,
    generateWeekSchedule,
    toggleTaskCompletion,
    toggleBlockedSlot,
    updateDaySchedule,
  };
};
