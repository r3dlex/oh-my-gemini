import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface McpServerDefinition {
  label: string;
  command: string;
  args?: string[];
}

async function tryRegisterMcpProvider(workspaceRoot: string): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lm = (vscode as any).lm;
  if (!lm || typeof lm.registerMcpServerDefinitionProvider !== 'function') {
    return false;
  }
  const serverPath = path.join(workspaceRoot, 'mcp-server', 'dist', 'index.js');
  if (!fs.existsSync(serverPath)) {
    return false;
  }
  try {
    const definition: McpServerDefinition = {
      label: 'oh-my-gemini MCP',
      command: 'node',
      args: [serverPath],
    };
    lm.registerMcpServerDefinitionProvider('omg', {
      provideMcpServerDefinitions: () => [definition],
    });
    return true;
  } catch {
    return false;
  }
}

function writeStaticMcpJson(workspaceRoot: string): void {
  const serverPath = path.join(workspaceRoot, 'mcp-server', 'dist', 'index.js');
  if (!fs.existsSync(serverPath)) {
    return;
  }
  const vscodeDir = path.join(workspaceRoot, '.vscode');
  const mcpPath = path.join(vscodeDir, 'mcp.json');
  if (fs.existsSync(mcpPath)) {
    return; // don't overwrite user config
  }
  try {
    if (!fs.existsSync(vscodeDir)) {
      fs.mkdirSync(vscodeDir, { recursive: true });
    }
    const config = {
      servers: {
        'oh-my-gemini': {
          type: 'stdio',
          command: 'node',
          args: [serverPath],
        },
      },
    };
    fs.writeFileSync(mcpPath, JSON.stringify(config, null, 2));
  } catch {
    // best-effort
  }
}

export async function registerMcpProvider(workspaceRoot: string): Promise<void> {
  const registered = await tryRegisterMcpProvider(workspaceRoot);
  if (!registered) {
    writeStaticMcpJson(workspaceRoot);
  }
}
