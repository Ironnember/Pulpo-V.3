import React, { useState } from 'react';
import {
  ListOrdered,
  Play,
  CheckCircle,
  UserPlus,
  Clock,
  AlertCircle,
  Hash,
  Coins,
  Cpu,
  Search,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { GovernedTask, TaskStatus } from '../types';

interface TaskQueueProps {
  tasks: GovernedTask[];
  onClaimTask: (taskId: string) => void;
  onRunTask: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
  onSelectTask?: (task: GovernedTask) => void;
}

export const TaskQueue: React.FC<TaskQueueProps> = ({
  tasks,
  onClaimTask,
  onRunTask,
  onCompleteTask,
  onSelectTask,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        task.id.toLowerCase().includes(q) ||
        task.intent.toLowerCase().includes(q) ||
        task.packetSha.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'queued':
        return (
          <span className="px-2 py-0.5 rounded bg-[#080E15] border border-[#06B6D4]/30 text-[#94A3B8] text-[9px] font-mono font-bold uppercase">
            Queued
          </span>
        );
      case 'claimed':
        return (
          <span className="px-2 py-0.5 rounded bg-[#06B6D4]/20 border border-[#06B6D4]/40 text-[#00F0FF] text-[9px] font-mono font-bold uppercase">
            Claimed
          </span>
        );
      case 'running':
        return (
          <span className="px-2 py-0.5 rounded bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#F59E0B] text-[9px] font-mono font-bold uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-ping" />
            Running
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] text-[9px] font-mono font-bold uppercase">
            Complete
          </span>
        );
      case 'blocked':
        return (
          <span className="px-2 py-0.5 rounded bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#F87171] text-[9px] font-mono font-bold uppercase">
            Blocked
          </span>
        );
    }
  };

  return (
    <section
      id="task-queue-section"
      className="bg-[#060C14]/45 backdrop-blur-xl border border-[#06B6D4]/25 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden font-mono cyber-card"
    >
      {/* Header */}
      <div className="px-4 py-2.5 bg-[#0C1A28]/40 border-b border-[#06B6D4]/20 flex flex-wrap items-center justify-between gap-2 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-3.5 h-3.5 text-[#00F0FF]" />
          <h2 className="text-[11px] uppercase font-bold text-[#94A3B8] tracking-widest">
            Task Queue · Multi-Core Governed Scheduler ({tasks.length})
          </h2>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3 h-3 text-[#64748B] absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks or sha..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#080E15]/50 border border-[#06B6D4]/30 focus:border-[#00F0FF] pl-7 pr-2 py-1 rounded text-[11px] text-white focus:outline-none w-36 sm:w-44 backdrop-blur-md"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#080E15]/50 border border-[#06B6D4]/30 text-[#94A3B8] px-2 py-1 rounded text-[11px] focus:outline-none cursor-pointer backdrop-blur-md"
          >
            <option value="all">All States</option>
            <option value="queued">Queued</option>
            <option value="claimed">Claimed</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="p-4 space-y-2.5 max-h-[420px] overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-[#64748B] text-xs">
            No governed tasks match filter criteria.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              id={`task-item-${task.id}`}
              className="p-3 rounded-lg border border-[#06B6D4]/20 bg-[#080E15]/40 hover:bg-[#0D1824]/60 hover:border-[#06B6D4]/50 transition-all flex flex-col gap-2 shadow-xs backdrop-blur-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-white">{task.id}</span>
                  {getStatusBadge(task.status)}
                </div>

                <div className="flex items-center gap-2 text-[10px] text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <Hash className="w-2.5 h-2.5 text-[#00F0FF]" />
                    <span className="text-[#00F0FF]">{task.packetSha}</span>
                  </span>
                  <span>·</span>
                  <span className="text-[#34D399] font-bold">
                    {(task.tokensSaved ?? task.creditEstimate?.tokenSavings ?? 0).toLocaleString()} tok
                  </span>
                </div>
              </div>

              {/* Intent Text */}
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {task.intent}
              </p>

              {/* Task Footer & Controls */}
              <div className="pt-2 border-t border-[#06B6D4]/10 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                <div className="text-[#64748B]">
                  Principal: <strong className="text-white">{task.principal}</strong>
                </div>

                <div className="flex items-center gap-1.5">
                  {task.status === 'queued' && (
                    <button
                      onClick={() => onClaimTask(task.id)}
                      className="px-2.5 py-1 bg-[#0F1B27]/60 hover:bg-[#152535]/80 border border-[#06B6D4]/40 hover:border-[#00F0FF] text-[#00F0FF] rounded font-bold uppercase cursor-pointer backdrop-blur-md"
                    >
                      Claim Core
                    </button>
                  )}

                  {task.status === 'claimed' && (
                    <button
                      onClick={() => onRunTask(task.id)}
                      className="px-2.5 py-1 bg-gradient-to-r from-[#06B6D4] to-[#10B981] text-black font-extrabold uppercase cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                    >
                      Execute Sandbox
                    </button>
                  )}

                  {task.status === 'running' && (
                    <button
                      onClick={() => onCompleteTask(task.id)}
                      className="px-2.5 py-1 bg-[#10B981]/20 hover:bg-[#10B981]/30 border border-[#10B981]/50 text-[#34D399] rounded font-bold uppercase cursor-pointer backdrop-blur-md"
                    >
                      Seal Receipt
                    </button>
                  )}

                  {task.status === 'completed' && (
                    <span className="text-[#34D399] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Sealed & Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
