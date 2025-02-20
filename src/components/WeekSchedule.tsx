
import { useEffect } from 'react';
import { TimeSlot } from '@/hooks/useSchedule';
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from 'framer-motion';

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
      {Object.entries(schedule).map(([day, slots], dayIndex) => (
        <motion.div
          key={day}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: dayIndex * 0.1 }}
          className="bg-white rounded-lg shadow-sm p-4"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            {day}
          </h2>
          <div className="space-y-3">
            {slots.map((slot, slotIndex) => (
              <div
                key={`${slot.start}-${slot.end}`}
                className={`p-3 rounded-md ${
                  slot.isFixed ? 'bg-gray-50' : 'bg-[#fff5f5]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-500">
                    {slot.start} - {slot.end}
                  </span>
                  {slot.task && (
                    <Checkbox
                      checked={slot.task.completed}
                      onCheckedChange={() => onToggleTask(day, slotIndex)}
                      className="border-[#ea384c] data-[state=checked]:bg-[#ea384c]"
                    />
                  )}
                </div>
                {slot.task && (
                  <p className={`text-sm ${
                    slot.task.completed ? 'line-through text-gray-400' : 'text-gray-700'
                  }`}>
                    {slot.task.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default WeekSchedule;
