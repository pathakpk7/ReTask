import React from 'react';
import { useTaskContext } from '../store/TaskContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Folder, Plus, Edit2, Trash2 } from 'lucide-react';

export function ListsPage() {
  const { lists, tasks, setActiveList, openListModal, deleteList } = useTaskContext();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#829188]">
          Categorical List System ({lists.length})
        </h2>
        <Button variant="primary" size="sm" onClick={() => openListModal()}>
          <Plus className="w-3.5 h-3.5" />
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
              className="p-5 space-y-4 hover:border-[#19C37D] cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 border border-[#1A261E] clip-cut-tr"
                    style={{ backgroundColor: `${list.color}15`, borderColor: list.color }}
                  >
                    <Folder className="w-5 h-5" style={{ color: list.color }} />
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-bold text-[#E8F0EA] uppercase">
                      {list.name}
                    </h3>
                    <span className="text-[10px] font-mono text-[#829188]">
                      ID: #{list.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openListModal(list);
                    }}
                    title="Edit List"
                    className="p-1 text-[#829188] hover:text-[#E8F0EA] hover:bg-[#101712] clip-cut-tr transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
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
                      className="p-1 text-[#829188] hover:text-[#FF4757] hover:bg-[#2A0E13] clip-cut-tr transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <span className="font-mono text-xs font-bold text-[#19C37D] bg-[#050705] border border-[#1A261E] px-2.5 py-1 clip-cut-tr">
                    {listTasks.length} Tasks
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[10px] text-[#829188]">
                  <span>Completion Status</span>
                  <span>{completedCount} / {listTasks.length} Done</span>
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
