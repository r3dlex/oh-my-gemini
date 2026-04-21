import * as vscode from 'vscode';
import { StateReader } from '../state/reader';

export class OmgStatusBar {
  private readonly _item: vscode.StatusBarItem;
  private readonly _watcher: vscode.FileSystemWatcher;
  private _debounceTimer: NodeJS.Timeout | undefined;

  constructor(private readonly reader: StateReader) {
    this._item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    this._item.command = 'omg.showStatus';
    this._watcher = vscode.workspace.createFileSystemWatcher('**/.omc/state/subagent-tracker.json');
    this._watcher.onDidChange(() => this._scheduleUpdate());
    this._watcher.onDidCreate(() => this._scheduleUpdate());
    this._watcher.onDidDelete(() => this._scheduleUpdate());
    this._update();
    this._item.show();
  }

  private _scheduleUpdate(): void {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }
    this._debounceTimer = setTimeout(() => this._update(), 200);
  }

  private _update(): void {
    const agents = this.reader.getAgents();
    const running = agents.filter(a => a.status === 'running').length;
    if (running === 0) {
      this._item.text = '$(zap) OMG: idle';
      this._item.tooltip = 'oh-my-gemini: no active agents';
    } else {
      this._item.text = `$(sync~spin) OMG: ${running} agent${running === 1 ? '' : 's'} running`;
      this._item.tooltip = `oh-my-gemini: ${running} agent${running === 1 ? '' : 's'} running`;
    }
  }

  dispose(): void {
    this._watcher.dispose();
    this._item.dispose();
  }
}
