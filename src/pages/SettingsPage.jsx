import React, { useRef, useState } from 'react';
import { useTaskContext } from '../store/TaskContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { storageService } from '../services/storageService';
import { Settings, Download, Upload, RotateCcw, Database, ShieldCheck } from 'lucide-react';

export function SettingsPage() {
  const { tasks, lists, resetSeedData } = useTaskContext();
  const fileInputRef = useRef(null);
  const [statusMsg, setStatusMsg] = useState('');

  const handleExport = () => {
    const data = {
      version: '2.0',
      timestamp: new Date().toISOString(),
      tasks: storageService.getTasks(),
      lists: storageService.getLists(),
      settings: storageService.getSettings(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `retask_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg('Export file generated successfully.');
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed && Array.isArray(parsed.tasks)) {
          storageService.saveTasks(parsed.tasks);
          if (Array.isArray(parsed.lists)) {
            storageService.saveLists(parsed.lists);
          }
          window.location.reload();
        } else {
          setStatusMsg('Error: Invalid backup file format.');
        }
      } catch (err) {
        setStatusMsg('Error parsing JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Reset all tasks and lists back to factory seed defaults?')) {
      resetSeedData();
      setStatusMsg('System restored to default sample state.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2.5">
        <Settings className="w-5 h-5 text-emerald-400" />
        <h2 className="text-sm font-semibold text-zinc-200">
          Settings & Data Management
        </h2>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl">
          {statusMsg}
        </div>
      )}

      {/* Storage & Backup Section */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
          <Database className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">
              Data Storage & Backup
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Manage your local browser database, export archives, or import data.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-[#161B22] border border-white/[0.05] space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-medium text-white block">Export Backup</span>
              <p className="text-xs text-zinc-400 mt-1">Download tasks, lists, and settings as a JSON archive.</p>
            </div>
            <Button variant="secondary" size="sm" fullWidth onClick={handleExport}>
              <Download className="w-3.5 h-3.5 mr-1" /> Export JSON
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-[#161B22] border border-white/[0.05] space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-medium text-white block">Restore Backup</span>
              <p className="text-xs text-zinc-400 mt-1">Import a previously saved JSON backup file.</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <Button variant="secondary" size="sm" fullWidth onClick={handleImportClick}>
              <Upload className="w-3.5 h-3.5 mr-1" /> Import JSON
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-[#161B22] border border-white/[0.05] space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-medium text-red-400 block">Factory Reset</span>
              <p className="text-xs text-zinc-400 mt-1">Reset your workspace back to initial clean demo tasks.</p>
            </div>
            <Button variant="danger" size="sm" fullWidth onClick={handleReset}>
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Defaults
            </Button>
          </div>
        </div>
      </Card>

      {/* Visual Identity Palette */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">
              Visual System Tokens
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              High-contrast, accessibility-audited color architecture.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
          <div className="p-3 rounded-lg bg-[#161B22] border border-white/[0.05]">
            <span className="text-zinc-500 text-[11px] block">Obsidian Base</span>
            <span className="text-white font-mono font-medium">#08090A</span>
          </div>
          <div className="p-3 rounded-lg bg-[#161B22] border border-white/[0.05]">
            <span className="text-zinc-500 text-[11px] block">Matte Surface</span>
            <span className="text-white font-mono font-medium">#0F1216</span>
          </div>
          <div className="p-3 rounded-lg bg-[#161B22] border border-white/[0.05]">
            <span className="text-zinc-500 text-[11px] block">Emerald Accent</span>
            <span className="text-emerald-400 font-mono font-medium">#10B981</span>
          </div>
          <div className="p-3 rounded-lg bg-[#161B22] border border-white/[0.05]">
            <span className="text-zinc-500 text-[11px] block">Elevated Slate</span>
            <span className="text-zinc-300 font-mono font-medium">#161B22</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
