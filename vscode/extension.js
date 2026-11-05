// @ts-check
// Registers the hosted Port OS MCP server with VS Code. VS Code runs the OAuth flow itself
// when the server starts. The URL and version come from the generated package.json.
const vscode = require('vscode');

const PROVIDER_ID = 'portos';
const LABEL = 'Port OS Smart Home';
const CONNECT_COMMAND = 'portos.connect';
// Set once VS Code has resolved the server, which it does only when starting it.
const STARTED_KEY = 'portos.started';
// VS Code starts extension servers lazily (when agent mode lists tools), so until the server has
// started once the extension keeps offering Connect. Starting the server is what opens the sign-in.
const CONNECT_ACTION = 'Connect';
const OPEN_CHAT_ACTION = 'Open Agent Chat';
const VERIFY_PROMPT = 'Show my connected devices';

/**
 * @param {{ version: string, portos: { mcpUrl: string } }} manifest
 * @param {() => void} [onStart] called when VS Code resolves the server to start it
 */
function createProvider(manifest, onStart = () => {}) {
  const changed = new vscode.EventEmitter();
  /** @type {vscode.McpServerDefinitionProvider<vscode.McpHttpServerDefinition>} */
  const provider = {
    onDidChangeMcpServerDefinitions: changed.event,
    provideMcpServerDefinitions: async () => [
      new vscode.McpHttpServerDefinition(LABEL, vscode.Uri.parse(manifest.portos.mcpUrl), {}, manifest.version),
    ],
    resolveMcpServerDefinition: async server => {
      onStart();
      return server;
    },
  };
  return { provider, changed };
}

// VS Code ids extension servers as "<lowercased extension id>/<label>".
/** @param {string} extensionId */
function serverId(extensionId) {
  return `${extensionId.toLowerCase()}/${LABEL}`;
}

/** @param {string} extensionId */
async function connect(extensionId) {
  try {
    // waitForLiveTools resolves once sign-in finished and the tools are listed.
    await vscode.commands.executeCommand('workbench.mcp.startServer', serverId(extensionId), { waitForLiveTools: true });
  } catch {
    // Older VS Code builds without the command: fall back to the server list, where Start signs in.
    await vscode.commands.executeCommand('workbench.mcp.listServer');
    return;
  }
  const choice = await vscode.window.showInformationMessage(`${LABEL} is connected. Ask Copilot in agent mode: "${VERIFY_PROMPT}".`, OPEN_CHAT_ACTION);
  if (choice === OPEN_CHAT_ACTION) await vscode.commands.executeCommand('workbench.action.chat.open', { mode: 'agent', query: VERIFY_PROMPT, isPartialQuery: true });
}

/** @param {vscode.ExtensionContext} context */
function activate(context) {
  const statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
  statusItem.text = '$(plug) Port OS: Connect';
  statusItem.tooltip = `Start ${LABEL} and sign in to Port OS`;
  statusItem.command = CONNECT_COMMAND;
  const started = () => {
    statusItem.hide();
    void context.globalState.update(STARTED_KEY, true);
  };
  const { provider, changed } = createProvider(context.extension.packageJSON, started);
  context.subscriptions.push(
    changed,
    statusItem,
    vscode.lm.registerMcpServerDefinitionProvider(PROVIDER_ID, provider),
    vscode.commands.registerCommand(CONNECT_COMMAND, () => connect(context.extension.id)),
  );
  if (context.globalState.get(STARTED_KEY)) return;
  statusItem.show();
  // Not awaited: starting the server waits for this activation to finish.
  void vscode.window
    .showInformationMessage(`${LABEL} is installed. Connect and sign in to Port OS to use your devices from Copilot agent mode.`, CONNECT_ACTION)
    .then(choice => (choice === CONNECT_ACTION ? connect(context.extension.id) : undefined));
}

function deactivate() {}

module.exports = { activate, deactivate, createProvider, connect, serverId };
