import React from 'react';

const KanbanBoard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quadro Kanban</h1>
        <p className="text-gray-600">Visualize e organize suas tarefas</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">Quadro Kanban será exibido aqui.</p>
      </div>
    </div>
  );
};

export default KanbanBoard;
