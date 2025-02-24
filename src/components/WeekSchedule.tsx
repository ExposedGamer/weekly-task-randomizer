
import { useEffect, useState } from 'react';
import { TimeSlot, WeekHistory } from '@/hooks/useSchedule';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Save, Clock } from 'lucide-react';

interface WeekScheduleProps {
  schedule: Record<string, TimeSlot[]>;
  onToggleTask: (day: string, slotIndex: number) => void;
  onRegenerate: () => void;
  onUpdateSchedule: (day: string, slots: { start: string; end: string }[]) => void;
  weekHistory?: WeekHistory[];
}

const WeekSchedule = ({ schedule, onToggleTask, onRegenerate, onUpdateSchedule, weekHistory = [] }: WeekScheduleProps) => {
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [editedSlots, setEditedSlots] = useState<{ start: string; end: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (Object.keys(schedule).length === 0) {
      onRegenerate();
    }
  }, [onRegenerate, schedule]);

  const handleEditDay = (day: string) => {
    setEditingDay(day);
    setEditedSlots(schedule[day].map(slot => ({ start: slot.start, end: slot.end })));
  };

  const handleSaveSchedule = (day: string) => {
    onUpdateSchedule(day, editedSlots);
    setEditingDay(null);
  };

  const handleAddSlot = () => {
    setEditedSlots([...editedSlots, { start: '00:00', end: '00:00' }]);
  };

  const handleRemoveSlot = (index: number) => {
    setEditedSlots(editedSlots.filter((_, i) => i !== index));
  };

  const handleSlotChange = (index: number, field: 'start' | 'end', value: string) => {
    const newSlots = [...editedSlots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setEditedSlots(newSlots);
  };

  return (
    <div className="space-y-6">
      {weekHistory.length > 0 && (
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2"
          >
            <Clock size={16} />
            {showHistory ? 'Ocultar Histórico' : 'Ver Histórico'}
          </Button>
        </div>
      )}

      {showHistory && weekHistory.length > 0 && (
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Histórico de Semanas</h2>
          <div className="flex gap-4 pb-4 overflow-x-auto">
            {weekHistory.map((week) => (
              <div 
                key={week.id} 
                className="flex-shrink-0 w-[300px] bg-gray-50 p-4 rounded-lg border border-gray-100"
              >
                <div className="mb-2">
                  <div className="font-medium text-gray-900">Semana de {week.date}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {week.completedTasks} de {week.totalTasks} tarefas completadas (
                    {Math.round((week.completedTasks / week.totalTasks) * 100)}%)
                  </div>
                </div>
                <div className="space-y-2">
                  {Object.entries(week.schedule).map(([day, slots]) => (
                    <div key={day} className="bg-white p-2 rounded-md">
                      <h3 className="text-sm font-medium text-gray-700 mb-1">{day}</h3>
                      <div className="space-y-1">
                        {slots.map((slot, index) => (
                          <div
                            key={index}
                            className={`text-xs p-1 rounded ${
                              slot.task?.completed ? 'bg-green-50' : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">
                                {slot.start} - {slot.end}
                              </span>
                              {slot.task?.completed && (
                                <span className="text-green-600">✓</span>
                              )}
                            </div>
                            <p className={`truncate ${slot.task?.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                              {slot.task?.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {Object.entries(schedule).map(([day, slots], dayIndex) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ 
                duration: 0.3,
                delay: dayIndex * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="bg-white rounded-lg shadow-sm p-4 transform-gpu"
            >
              <div className="flex justify-between items-center mb-4">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: dayIndex * 0.1 + 0.2 }}
                  className="text-lg font-semibold text-gray-800"
                >
                  {day}
                </motion.h2>
                {editingDay === day ? (
                  <Button
                    size="sm"
                    onClick={() => handleSaveSchedule(day)}
                    className="bg-[#ea384c] hover:bg-[#d62d3f] text-white"
                  >
                    <Save size={16} />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditDay(day)}
                  >
                    <Edit2 size={16} />
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                {editingDay === day ? (
                  <>
                    {editedSlots.map((slot, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-2 items-center"
                      >
                        <Input
                          type="time"
                          value={slot.start}
                          onChange={(e) => handleSlotChange(index, 'start', e.target.value)}
                          className="w-24"
                        />
                        <span>-</span>
                        <Input
                          type="time"
                          value={slot.end}
                          onChange={(e) => handleSlotChange(index, 'end', e.target.value)}
                          className="w-24"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveSlot(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          ×
                        </Button>
                      </motion.div>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAddSlot}
                      className="w-full mt-2"
                    >
                      + Adicionar Horário
                    </Button>
                  </>
                ) : (
                  slots.map((slot, slotIndex) => (
                    <motion.div
                      key={`${slot.start}-${slot.end}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: dayIndex * 0.1 + slotIndex * 0.05,
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      className={`p-3 rounded-md transform-gpu ${
                        slot.isFixed ? 'bg-gray-50' : 'bg-[#fff5f5]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-500">
                          {slot.start} - {slot.end}
                        </span>
                        {slot.task && (
                          <motion.div
                            whileTap={{ scale: 0.9 }}
                          >
                            <Checkbox
                              checked={slot.task.completed}
                              onCheckedChange={() => onToggleTask(day, slotIndex)}
                              className="border-[#ea384c] data-[state=checked]:bg-[#ea384c]"
                            />
                          </motion.div>
                        )}
                      </div>
                      {slot.task && (
                        <motion.p
                          animate={{
                            opacity: slot.task.completed ? 0.5 : 1,
                            textDecoration: slot.task.completed ? 'line-through' : 'none'
                          }}
                          className={`text-sm ${
                            slot.task.completed ? 'text-gray-400' : 'text-gray-700'
                          }`}
                        >
                          {slot.task.name}
                        </motion.p>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WeekSchedule;
