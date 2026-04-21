import * as vscode from 'vscode';
import { OmgStateAdapter } from './state/adapter';
import { WorkflowTreeProvider, AgentTreeProvider, TaskTreeProvider } from './ui/tree-view';
import { OmgStatusBar } from './ui/status-bar';
import { registerMcpProvider } from './mcp/provider';

export function activate(context: vscode.ExtensionContext): void {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? '';
  const adapter = new OmgStateAdapter(workspaceRoot);

  const workflowProvider = new WorkflowTreeProvider(adapter);
  const agentProvider = new AgentTreeProvider(adapter);
  const taskProvider = new TaskTreeProvider(adapter);

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('omg.workflows', workflowProvider),
    vscode.window.registerTreeDataProvider('omg.agents', agentProvider),
    vscode.window.registerTreeDataProvider('omg.tasks', taskProvider),
  );

  const config = vscode.workspace.getConfiguration('omg');
  if (config.get<boolean>('showStatusBar', true)) {
    const statusBar = new OmgStatusBar(adapter);
    context.subscriptions.push({ dispose: () => statusBar.dispose() });
  }

  context.subscriptions.push(
    vscode.commands.registerCommand('omg.showStatus', async () => {
      const agents = adapter.getAgents();
      if (agents.length === 0) {
        vscode.window.showInformationMessage('OMG: No agents found.');
        return;
      }
      const items = agents.map(a => ({
        label: a.type,
        description: `${a.status}${a.teamName ? ` · ${a.teamName}` : ''}`,
        detail: a.summary,
      }));
      await vscode.window.showQuickPick(items, { title: 'oh-my-gemini Agents', placeHolder: 'Current agent list' });
    }),

    vscode.commands.registerCommand('omg.clearState', () => {
      vscode.window.showInformationMessage('OMG: Clear state is not supported. Use the oh-my-gemini CLI to manage state.');
    }),
  );

  registerMcpProvider(workspaceRoot).catch(() => undefined);
}

export function deactivate(): void {
  // nothing to clean up — subscriptions are disposed automatically
}
