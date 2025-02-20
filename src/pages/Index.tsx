
import { Button } from "@/components/ui/button";
import WeekSchedule from "@/components/WeekSchedule";
import TaskEditor from "@/components/TaskEditor";
import { useSchedule } from "@/hooks/useSchedule";
import { Shuffle } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const { tasks, schedule, updateTasks, generateWeekSchedule, toggleTaskCompletion } = useSchedule();
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Meu Cronograma Semanal</h1>
            <div className="flex gap-3">
              <Button
                onClick={() => generateWeekSchedule()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Shuffle size={18} />
                Sortear Novamente
              </Button>
              <Button
                onClick={() => setShowEditor(!showEditor)}
                className="bg-[#ea384c] hover:bg-[#d62d3f] text-white"
              >
                {showEditor ? 'Fechar Editor' : 'Editar Tarefas'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6">
        {showEditor ? (
          <TaskEditor tasks={tasks} onUpdate={updateTasks} />
        ) : (
          <WeekSchedule
            schedule={schedule}
            onToggleTask={toggleTaskCompletion}
            onRegenerate={generateWeekSchedule}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
