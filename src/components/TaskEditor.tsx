
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task } from '@/hooks/useSchedule';
import { X } from 'lucide-react';

interface TaskEditorProps {
  tasks: Task[];
  onUpdate: (tasks: Task[]) => void;
}

const TaskEditor = ({ tasks, onUpdate }: TaskEditorProps) => {
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      name: newTask.trim(),
      completed: false,
    };

    onUpdate([...tasks, task]);
    setNewTask('');
  };

  const handleRemoveTask = (id: string) => {
    onUpdate(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Editar Tarefas</h2>
      
      <div className="flex gap-2 mb-4">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nova tarefa..."
          className="flex-1"
        />
        <Button 
          onClick={handleAddTask}
          className="bg-[#ea384c] hover:bg-[#d62d3f] text-white"
        >
          Adicionar
        </Button>
      </div>

      <ul className="space-y-2">
        {tasks.map(task => (
          <li 
            key={task.id}
            className="flex items-center justify-between bg-gray-50 p-2 rounded"
          >
            <span className="text-gray-700">{task.name}</span>
            <button
              onClick={() => handleRemoveTask(task.id)}
              className="text-gray-400 hover:text-[#ea384c] transition-colors"
            >
              <X size={18} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskEditor;
