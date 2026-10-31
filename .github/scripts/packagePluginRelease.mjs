import { createHash } from 'node:crypto';
import { cp, lstat, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateCloudConfig, validateCodexConfig, validateOpenAIListing, validateInventory, validatePortableAuth } from './pluginPackage.mjs';
import { zipDirectory } from './zipDirectory.mjs';

// Runs both in the monorepo and the exported plugin repository. Only the
// platform allowlists enter ZIPs; workflows, registry metadata and Git never do.
export async function packagePluginRelease(source, output) {
  const json = async name => JSON.parse(await readFile(path.join(source, name), 'utf8'));
  const portable = await json('plugin.json');
  const claude = await json('.claude-plugin/plugin.json');
  if (portable.$schema !== 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json')
    throw new Error('Portable plugin must use the Agent Plugins 1.0 manifest.');
  if (portable.apps != null || portable.extensions?.['com.openai']?.apps != null)
    throw new Error('Public packages cannot contain account app bindings.');
  if (portable.name !== 'portos' || claude.name !== portable.name ||
      !/^\d+\.\d+\.\d+$/.test(portable.version) || claude.version !== portable.version)
    throw new Error('Platform identities and semantic versions must agree.');
  validateCloudConfig(await json('chatgpt.mcp.json'), 'streamable-http');
  validateCodexConfig(await json('codex.mcp.json'));
  validateCloudConfig(await json('.mcp.json'), 'http');
  validateOpenAIListing(portable.extensions['com.openai']);
  validatePortableAuth(await json('chatgpt.mcp.json'));
  const qa = await json('qa.json');
  if (!qa || typeof qa !== 'object' || Object.keys(qa).sort().join(',') !== 'appId,scopes,submissionAppId' ||
      ![qa.appId, qa.submissionAppId].every(id => typeof id === 'string' && /^asdk_app_[A-Za-z0-9][A-Za-z0-9_-]*$/.test(id)) ||
      !Array.isArray(qa.scopes) || !qa.scopes.length || new Set(qa.scopes).size !== qa.scopes.length ||
      !qa.scopes.every(scope => typeof scope === 'string' && /^[a-z-]+:[a-z]+$/.test(scope)))
    throw new Error('qa.json must contain only the verified QA appId, Portal submissionAppId and unique scopes.');
  if (qa.appId === qa.submissionAppId)
    throw new Error('ChatGPT QA must use its own accessible registration, not the unpublished Portal App.');
  await mkdir(output, { recursive: true });
  const stage = await mkdtemp(path.join(tmpdir(), 'portos-plugin-release-'));
  const assets = [];
  try {
    for (const platform of ['claude', 'chatgpt', 'codex', 'chatgpt-qa']) {
      const host = platform === 'chatgpt-qa' ? 'chatgpt' : platform;
      const directory = path.join(stage, platform);
      const files = ['skills', 'assets', 'README.md', 'LICENSE.md',
        ...(platform === 'claude' ? ['.claude-plugin/plugin.json', '.mcp.json'] : ['plugin.json'])];
      for (const name of files) {
        await validateInventoryPath(path.join(source, name));
        await cp(path.join(source, name), path.join(directory, name), { recursive: true });
      }
      if (platform !== 'claude') await cp(path.join(source, `${host}.mcp.json`), path.join(directory, 'mcp.json'));
      await validateInventory(directory);
      if (platform === 'chatgpt-qa') {
        const manifest = structuredClone(portable);
        manifest.extensions['com.openai'].apps = './.app.json';
        manifest.extensions['com.openai'].interface.displayName += ' QA';
        validateOpenAIListing(manifest.extensions['com.openai']);
        await writeFile(path.join(directory, 'plugin.json'), `${JSON.stringify(manifest, null, 2)}\n`);
        await writeFile(path.join(directory, '.app.json'), `${JSON.stringify({ apps: { portos: { id: qa.appId, required: true } } }, null, 2)}\n`);
        const mcp = await json('chatgpt.mcp.json');
        const auth = mcp.mcpServers.portos.extensions['com.openai'].auth;
        auth.baseScopes = qa.scopes;
        auth.defaultScopes = qa.scopes;
        await writeFile(path.join(directory, 'mcp.json'), `${JSON.stringify(mcp, null, 2)}\n`);
      }
      const name = `portos-${platform}-${portable.version}.zip`;
      const bytes = zipDirectory(directory);
      await writeFile(path.join(output, name), bytes);
      assets.push({ name, sha256: createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length });
    }
    await writeFile(path.join(output, 'SHA256SUMS'), assets.map(asset => `${asset.sha256}  ${asset.name}\n`).join(''));
    return { version: portable.version, qaAppId: qa.appId, submissionAppId: qa.submissionAppId, qaScopes: qa.scopes, assets };
  } finally {
    await rm(stage, { recursive: true, force: true });
  }
}

async function validateInventoryPath(entry) {
  const info = await lstat(entry);
  if (info.isSymbolicLink()) throw new Error('Plugin packages cannot contain symlinks.');
  if (info.isDirectory()) await validateInventory(entry);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [source, output] = process.argv.slice(2);
  if (!source || !output) throw new Error('Usage: packagePluginRelease.mjs <plugin source> <output directory>');
  const result = await packagePluginRelease(path.resolve(source), path.resolve(output));
  process.stdout.write(`${JSON.stringify(result)}\n`);
}
