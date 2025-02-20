
import { useEffect } from 'react';
import { TimeSlot } from '@/hooks/useSchedule';
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from 'framer-motion';

interface WeekScheduleProps {
  schedule: Record<string, TimeSlot[]>;
  onToggleTask: (day: string, slotIndex: number) => void;
  onRegenerate: () => void;
}

const WeekSchedule = ({ schedule, onToggleTask, onRegenerate }: WeekScheduleProps) => {
  useEffect(() => {
    onRegenerate();
  }, [onRegenerate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
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
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: dayIndex * 0.1 + 0.2 }}
              className="text-lg font-semibold mb-4 text-gray-800"
            >
              {day}
            </motion.h2>
            <div className="space-y-3">
              {slots.map((slot, slotIndex) => (
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
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default WeekSchedule;
