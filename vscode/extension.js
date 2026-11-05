// @ts-check
// Registers the hosted Port OS MCP server with VS Code. VS Code runs the OAuth flow itself,
// so this shim only declares the server. The URL and version come from the generated package.json.
const vscode = require('vscode');

const PROVIDER_ID = 'portos';
const LABEL = 'Port OS Smart Home';

/** @param {{ version: string, portos: { mcpUrl: string } }} manifest */
function createProvider(manifest) {
  const changed = new vscode.EventEmitter();
  /** @type {vscode.McpServerDefinitionProvider<vscode.McpHttpServerDefinition>} */
  const provider = {
    onDidChangeMcpServerDefinitions: changed.event,
    provideMcpServerDefinitions: async () => [
      new vscode.McpHttpServerDefinition(LABEL, vscode.Uri.parse(manifest.portos.mcpUrl), {}, manifest.version),
    ],
    resolveMcpServerDefinition: async server => server,
  };
  return { provider, changed };
}

/** @param {vscode.ExtensionContext} context */
function activate(context) {
  const { provider, changed } = createProvider(context.extension.packageJSON);
  context.subscriptions.push(changed, vscode.lm.registerMcpServerDefinitionProvider(PROVIDER_ID, provider));
}

function deactivate() {}

module.exports = { activate, deactivate, createProvider };
