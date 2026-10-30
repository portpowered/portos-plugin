import { readdir, lstat } from 'node:fs/promises';
import path from 'node:path';

const cloudURL = 'https://api.portoperatingsystem.com/mcp';

export function validateCloudConfig(config, transport) {
  const entries = Object.entries(config.mcpServers ?? {});
  if (entries.length !== 1 || entries[0][0] !== 'portos') throw new Error('Port OS must have exactly one cloud MCP connection.');
  const server = entries[0][1];
  if (server.type !== transport || server.url !== cloudURL) throw new Error('Port OS must use its canonical cloud MCP endpoint.');
  for (const key of ['command', 'args', 'env', 'headers', 'clientSecret']) {
    if (key in server) throw new Error(`Cloud package cannot contain ${key}.`);
  }
}


const categories = ['Productivity', 'Creativity', 'Developer Tools', 'Business & Operations', 'Data & Analytics', 'Communication', 'Education & Research', 'Security', 'Finance', 'Healthcare', 'Travel', 'Entertainment', 'Other'];

// OpenAI's final directory submission rules (developers.openai.com/plugins/deploy/submission-errors), checked
// here because the portal accepts an upload that final submission later rejects.
export function validateOpenAIListing(extension) {
  const { interface: listing, review, publication } = extension;
  const line = (value, max, field) => {
    if (typeof value !== 'string' || !value.trim() || /[\r\n]/.test(value) || value.length > max) throw new Error(`${field} must be one non-empty line of at most ${max} characters.`);
  };
  line(listing.displayName, 30, 'Display name');
  line(listing.shortDescription, 30, 'Short description');
  line(listing.developerName, 80, 'Developer name');
  if (!listing.longDescription?.trim() || listing.longDescription.length > 4000) throw new Error('Long description must be non-empty and at most 4000 characters.');
  if (!categories.includes(listing.category)) throw new Error(`Category must be one of ${categories.join(', ')}.`);
  if (listing.capabilities.length > 20) throw new Error('Use at most 20 capabilities.');
  for (const value of listing.capabilities) line(value, 120, 'Each capability');
  const prompts = listing.defaultPrompt.map(value => value.normalize('NFKC').replace(/\s+/g, ' ').trim());
  if (prompts.length > 3 || new Set(prompts).size !== prompts.length) throw new Error('Use at most three unique starter prompts.');
  for (const value of listing.defaultPrompt) {
    line(value, 128, 'Each starter prompt');
    if (value.includes('@')) throw new Error('Starter prompts cannot @mention a server.');
  }
  for (const field of ['websiteURL', 'supportURL', 'privacyPolicyURL', 'termsOfServiceURL']) {
    if (!/^https:\/\/[^\s@]+$/.test(listing[field] ?? '') || listing[field].length > 1024) throw new Error(`${field} must be an HTTPS URL.`);
  }
  const { positive, negative } = review.test_cases;
  if (positive.length !== 5 || negative.length !== 3) throw new Error('Prepare exactly five positive and three negative cases.');
  for (const testCase of [...positive, ...negative]) if (!testCase.description?.trim() || !testCase.prompt?.trim()) throw new Error('Every test case needs a description and a prompt.');
  for (const testCase of positive) if (!testCase.tools_triggered?.trim() || !testCase.expected_behavior?.trim()) throw new Error('Every positive case needs tools_triggered and expected_behavior.');
  if ('test_credentials' in review || 'reviewer_instructions' in review) throw new Error('Reviewer credentials belong in the portal, never in the package.');
  if (!publication.release_notes?.trim()) throw new Error('Write release notes for this version.');
}

export async function validateInventory(directory) {
  for (const name of await readdir(directory)) {
    if (['node_modules', 'hooks', 'scripts', '.env', '.app.json'].includes(name)) throw new Error(`Unexpected package entry: ${name}`);
    const entry = path.join(directory, name);
    const info = await lstat(entry);
    if (info.isSymbolicLink()) throw new Error('Plugin packages cannot contain symlinks.');
    if (info.isDirectory()) await validateInventory(entry);
  }
}


export function validatePortableAuth(config) {
  if (config.$schema !== 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json')
    throw new Error('Portable connection must use the Agent Plugins 1.0 MCP schema.');
  const auth = config.mcpServers.portos.extensions?.['com.openai']?.auth;
  if (auth?.type !== 'oauth' || auth.client?.mode !== 'cimd' || auth.resource !== cloudURL)
    throw new Error('OpenAI cloud connection must use discovered OAuth with a Client ID Metadata Document.');
  if (JSON.stringify(auth).includes('clientSecret') || JSON.stringify(auth).includes('clientId'))
    throw new Error('CIMD configuration cannot embed client credentials.');
}
