import React from 'react';
import { useTaskContext } from '../store/TaskContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Folder, Plus, Edit2, Trash2 } from 'lucide-react';

export function ListsPage() {
  const { lists, tasks, setActiveList, openListModal, deleteList } = useTaskContext();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-200">
          Lists ({lists.length})
        </h2>
        <Button variant="primary" size="sm" onClick={() => openListModal()}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>New List</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lists.map((list) => {
          const listTasks = tasks.filter((t) => t.listId === list.id);
          const completedCount = listTasks.filter((t) => t.completed).length;
          const percent = listTasks.length > 0 ? Math.round((completedCount / listTasks.length) * 100) : 0;

          return (
            <Card
              key={list.id}
              onClick={() => setActiveList(list.id)}
              className="p-5 space-y-4 hover:border-white/[0.16] cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-lg"
                    style={{ backgroundColor: `${list.color}15`, border: `1px solid ${list.color}30` }}
                  >
                    <Folder className="w-5 h-5" style={{ color: list.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {list.name}
                    </h3>
                    <span className="text-xs text-zinc-400">
                      {listTasks.length} {listTasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openListModal(list);
                    }}
                    title="Edit List"
                    className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {list.id !== 'inbox' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          window.confirm(
                            `Delete list "${list.name}"? Member tasks will be safely reassigned to Inbox.`
                          )
                        ) {
                          deleteList(list.id);
                        }
                      }}
                      title="Delete List"
                      className="p-1.5 text-zinc-400 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Progress</span>
                  <span className="font-mono text-zinc-300">{completedCount} of {listTasks.length} ({percent}%)</span>
                </div>
                <ProgressBar percent={percent} size="sm" showLabel={false} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
