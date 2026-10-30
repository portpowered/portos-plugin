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
  await mkdir(output, { recursive: true });
  const stage = await mkdtemp(path.join(tmpdir(), 'portos-plugin-release-'));
  const assets = [];
  try {
    for (const platform of ['claude', 'chatgpt', 'codex']) {
      const directory = path.join(stage, platform);
      const files = ['skills', 'assets', 'README.md', 'LICENSE.md',
        ...(platform === 'claude' ? ['.claude-plugin/plugin.json', '.mcp.json'] : ['plugin.json'])];
      for (const name of files) {
        await validateInventoryPath(path.join(source, name));
        await cp(path.join(source, name), path.join(directory, name), { recursive: true });
      }
      if (platform !== 'claude') await cp(path.join(source, `${platform}.mcp.json`), path.join(directory, 'mcp.json'));
      await validateInventory(directory);
      const name = `portos-${platform}-${portable.version}.zip`;
      const bytes = zipDirectory(directory);
      await writeFile(path.join(output, name), bytes);
      assets.push({ name, sha256: createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length });
    }
    await writeFile(path.join(output, 'SHA256SUMS'), assets.map(asset => `${asset.sha256}  ${asset.name}\n`).join(''));
    return { version: portable.version, assets };
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
