import * as vscode from 'vscode';
import { StateReader, WorkflowState, AgentInfo, TaskInfo } from '../state/reader';

function makeWatcher(pattern: string): vscode.FileSystemWatcher {
  return vscode.workspace.createFileSystemWatcher(pattern);
}

export class WorkflowTreeProvider implements vscode.TreeDataProvider<WorkflowState> {
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<WorkflowState | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  private _debounceTimer: NodeJS.Timeout | undefined;
  private readonly _watcher: vscode.FileSystemWatcher;

  constructor(private readonly reader: StateReader) {
    this._watcher = makeWatcher('**/.omc/**/*.json');
    this._watcher.onDidChange(() => this.refresh());
    this._watcher.onDidCreate(() => this.refresh());
    this._watcher.onDidDelete(() => this.refresh());
  }

  refresh(): void {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }
    this._debounceTimer = setTimeout(() => {
      this._onDidChangeTreeData.fire(undefined);
    }, 200);
  }

  dispose(): void {
    this._watcher.dispose();
    this._onDidChangeTreeData.dispose();
  }

  getTreeItem(element: WorkflowState): vscode.TreeItem {
    const label = element.mode;
    const item = new vscode.TreeItem(label, vscode.TreeItemCollapsibleState.None);
    item.description = element.active ? 'active' : 'stopped';
    if (element.phase) {
      item.tooltip = `Phase: ${element.phase}`;
    }
    item.iconPath = new vscode.ThemeIcon(element.active ? 'play-circle' : 'circle-slash');
    return item;
  }

  getChildren(): WorkflowState[] {
    return this.reader.getWorkflows();
  }
}

export class AgentTreeProvider implements vscode.TreeDataProvider<AgentInfo> {
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<AgentInfo | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  private _debounceTimer: NodeJS.Timeout | undefined;
  private readonly _watcher: vscode.FileSystemWatcher;

  constructor(private readonly reader: StateReader) {
    this._watcher = makeWatcher('**/.omc/**/*.json');
    this._watcher.onDidChange(() => this.refresh());
    this._watcher.onDidCreate(() => this.refresh());
    this._watcher.onDidDelete(() => this.refresh());
  }

  refresh(): void {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }
    this._debounceTimer = setTimeout(() => {
      this._onDidChangeTreeData.fire(undefined);
    }, 200);
  }

  dispose(): void {
    this._watcher.dispose();
    this._onDidChangeTreeData.dispose();
  }

  getTreeItem(element: AgentInfo): vscode.TreeItem {
    const item = new vscode.TreeItem(element.type, vscode.TreeItemCollapsibleState.None);
    item.description = element.status;
    const iconMap: Record<string, string> = {
      running: 'sync~spin',
      completed: 'check',
      failed: 'error',
      unknown: 'question',
    };
    item.iconPath = new vscode.ThemeIcon(iconMap[element.status] ?? 'question');
    if (element.summary) {
      item.tooltip = element.summary;
    }
    return item;
  }

  getChildren(): AgentInfo[] {
    return this.reader.getAgents();
  }
}

export class TaskTreeProvider implements vscode.TreeDataProvider<TaskInfo> {
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<TaskInfo | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  private _debounceTimer: NodeJS.Timeout | undefined;
  private readonly _watcher: vscode.FileSystemWatcher;

  constructor(private readonly reader: StateReader) {
    this._watcher = makeWatcher('**/.omc/**/*.json');
    this._watcher.onDidChange(() => this.refresh());
    this._watcher.onDidCreate(() => this.refresh());
    this._watcher.onDidDelete(() => this.refresh());
  }

  refresh(): void {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }
    this._debounceTimer = setTimeout(() => {
      this._onDidChangeTreeData.fire(undefined);
    }, 200);
  }

  dispose(): void {
    this._watcher.dispose();
    this._onDidChangeTreeData.dispose();
  }

  getTreeItem(_element: TaskInfo): vscode.TreeItem {
    return new vscode.TreeItem('No task data', vscode.TreeItemCollapsibleState.None);
  }

  getChildren(): vscode.ProviderResult<TaskInfo[]> {
    const tasks = this.reader.getTasks();
    if (tasks.length === 0) {
      // Return a synthetic placeholder
      return [{ id: '__placeholder__', subject: 'No task data', status: 'unknown' }];
    }
    return tasks;
  }
}
