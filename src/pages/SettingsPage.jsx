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
      version: '1.0',
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
      setStatusMsg('System restored to factory seed state.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-[#19C37D]" />
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#829188]">
          System Configuration & Data Management
        </h2>
      </div>

      {statusMsg && (
        <div className="p-3 bg-[#101712] border border-[#19C37D] text-[#19C37D] font-mono text-xs clip-cut-tr">
          {statusMsg}
        </div>
      )}

      {/* Storage & Backup Section */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-[#1A261E] pb-3">
          <Database className="w-5 h-5 text-[#19C37D]" />
          <div>
            <h3 className="font-mono text-sm font-bold text-[#E8F0EA] uppercase">
              LOCAL PERSISTENCE ENGINE
            </h3>
            <p className="text-xs font-sans text-[#829188]">
              Manage local database state, backups, and data imports.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-[#050705] border border-[#1A261E] clip-cut-tr space-y-3">
            <span className="text-[10px] font-mono text-[#829188] uppercase block">Data Backup</span>
            <p className="text-xs text-[#E8F0EA]">Export current task tree and settings to JSON file.</p>
            <Button variant="secondary" size="sm" fullWidth onClick={handleExport}>
              <Download className="w-3.5 h-3.5" /> Export JSON
            </Button>
          </div>

          <div className="p-4 bg-[#050705] border border-[#1A261E] clip-cut-tr space-y-3">
            <span className="text-[10px] font-mono text-[#829188] uppercase block">Restore Backup</span>
            <p className="text-xs text-[#E8F0EA]">Import tasks from a previously exported backup file.</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <Button variant="secondary" size="sm" fullWidth onClick={handleImportClick}>
              <Upload className="w-3.5 h-3.5" /> Import JSON
            </Button>
          </div>

          <div className="p-4 bg-[#050705] border border-[#1A261E] clip-cut-tr space-y-3">
            <span className="text-[10px] font-mono text-[#FF4757] uppercase block">Factory Reset</span>
            <p className="text-xs text-[#E8F0EA]">Reset storage back to initial factory demo seed state.</p>
            <Button variant="danger" size="sm" fullWidth onClick={handleReset}>
              <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
            </Button>
          </div>
        </div>
      </Card>

      {/* Visual Identity & Architecture Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-[#1A261E] pb-3">
          <ShieldCheck className="w-5 h-5 text-[#19C37D]" />
          <div>
            <h3 className="font-mono text-sm font-bold text-[#E8F0EA] uppercase">
              GEOMETRIC NEO-SKEUOMORPHISM IDENTITY
            </h3>
            <p className="text-xs font-sans text-[#829188]">
              Design System standards & UI specifications.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-center">
          <div className="p-3 bg-[#050705] border border-[#1A261E]">
            <span className="text-[#829188] text-[10px] block">BACKGROUND</span>
            <span className="text-[#E8F0EA] font-bold">#050705</span>
          </div>
          <div className="p-3 bg-[#050705] border border-[#1A261E]">
            <span className="text-[#829188] text-[10px] block">SURFACE</span>
            <span className="text-[#E8F0EA] font-bold">#0B100D</span>
          </div>
          <div className="p-3 bg-[#050705] border border-[#1A261E]">
            <span className="text-[#829188] text-[10px] block">PRIMARY GREEN</span>
            <span className="text-[#19C37D] font-bold">#19C37D</span>
          </div>
          <div className="p-3 bg-[#050705] border border-[#1A261E]">
            <span className="text-[#829188] text-[10px] block">DARK ACCENT</span>
            <span className="text-[#0B5D3B] font-bold">#0B5D3B</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
