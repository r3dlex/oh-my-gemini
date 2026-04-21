import * as fs from 'fs';
import * as path from 'path';
import { StateReader, WorkflowState, AgentInfo, TaskInfo } from './reader';

interface TrackedAgentRecord {
  id: string;
  type: string;
  status: 'running' | 'completed' | 'failed';
  teamName?: string;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  summary?: string;
}

interface SubagentTrackingState {
  schemaVersion: 1;
  updatedAt: string;
  agents: Record<string, TrackedAgentRecord>;
}

interface RawWorkflowState {
  mode: string;
  active: boolean;
  current_phase?: number;
  phase_name?: string;
  updated_at?: string;
}

export class OmgStateAdapter implements StateReader {
  constructor(private readonly workspaceRoot: string) {}

  getWorkflows(): WorkflowState[] {
    const stateDir = path.join(this.workspaceRoot, '.omc', 'state');
    if (!fs.existsSync(stateDir)) {
      return [];
    }
    const files = fs.readdirSync(stateDir).filter(f => f.endsWith('-state.json'));
    const workflows: WorkflowState[] = [];
    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(stateDir, file), 'utf8');
        const data = JSON.parse(raw) as RawWorkflowState;
        const id = file.replace(/-state\.json$/, '');
        workflows.push({
          id,
          mode: data.mode ?? id,
          active: data.active ?? false,
          phase: data.phase_name ?? (data.current_phase !== undefined ? String(data.current_phase) : undefined),
          updatedAt: data.updated_at,
        });
      } catch {
        // skip malformed files
      }
    }
    return workflows;
  }

  getAgents(): AgentInfo[] {
    const trackerPath = path.join(this.workspaceRoot, '.omc', 'state', 'subagent-tracker.json');
    if (!fs.existsSync(trackerPath)) {
      return [];
    }
    try {
      const raw = fs.readFileSync(trackerPath, 'utf8');
      const data = JSON.parse(raw) as SubagentTrackingState;
      return Object.values(data.agents ?? {}).map(a => ({
        id: a.id,
        type: a.type,
        status: a.status,
        teamName: a.teamName,
        startedAt: a.startedAt,
        updatedAt: a.updatedAt,
        summary: a.summary,
      }));
    } catch {
      return [];
    }
  }

  getTasks(): TaskInfo[] {
    // oh-my-gemini tracks tasks via Claude Code's native task system, not a local file
    return [];
  }
}
