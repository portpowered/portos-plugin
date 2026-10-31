# Port OS Smart Home

Connect Claude, ChatGPT or Codex to your existing smart home devices from Philips, Sonos, SmartThings and many others through the Port OS Smart Home plugin.

Port OS Smart Home is a cloud service that lets you and your agents work with your devices in your home, or from anywhere else in the world.

Use it in ChatGPT on the web or desktop, and in Codex. The OpenAI package
explicitly sets `requires_local_executor` to `false`: its MCP server is hosted
by Port OS, with no local server, command or desktop runtime required.

ChatGPT web also needs a registered hosted MCP connection. For public
distribution, upload this package through **With MCP** in the OpenAI Developer
Portal and complete its OAuth setup. A private ZIP import alone does not register
that connection; its owner must bind the plugin to an existing verified Port OS
connection. The public ZIP intentionally contains no personal connection IDs.

Port OS supports such functions as:

1. Show me the camera
2. Run the vacuum in the living room
3. Turn off the lights
4. Set the temperature
5. Ring my phone
6. Play a song on Spotify on the TV
7. Check if the doors are locked
8. Set an audio reminder on my speakers
9. Check my calendar and display it on the TV

Port OS exposes APIs in REST, MCP and other forms.

Port OS exposes APIs that allow agents to find your devices, check their state and control supported capabilities. Access follows the permissions you approve, with granular authorization per agent, device, person and capability.

Device support depends on the providers and capabilities connected to your account. Customers must link their own provider accounts and provide their own keys where appropriate. Port OS runs in the cloud; no local MCP server is required.

The plugin connects to `https://api.portoperatingsystem.com/mcp`. No local server is required.

## Connect

For Claude Code, install from the plugin-only GitHub repository:

```text
/plugin install portos --marketplace portpowered/portos-plugin
```

For Codex, install the complete public plugin, including its skills and remote MCP connection:

```text
codex plugin marketplace add portpowered/portos-plugin --ref v0.1.7 --json
codex plugin add portos@portos --json
```

For ChatGPT, use the ChatGPT ZIP from
[GitHub Releases](https://github.com/portpowered/portos-plugin/releases) in a
supported plugin-upload flow. Public-directory installation requires approval.

Either install adds the skills and the cloud connection
configuration. It does not start a local server or complete account authorization.

Install Port OS in the host, then connect through its OAuth flow. Sign in to
Port OS with Google or a Website sign-in access key and review the permissions.
Link providers through your Port OS account, completing any provider MFA there.
Ask “Show my connected devices” to verify discovery without controlling a device.

## Access keys

While signed in with Google, open Tokens, choose Create access key, select
Website sign-in, give it a name and expiry, and copy it once. Paste it only into
the Port OS sign-in form. It grants full account website access, including
explicit approval of AI connections. Keep it private.

Revoking or expiring the key ends its website/API access. OAuth connections
already approved with it remain independently revocable. API and automation
keys cannot sign in or approve new connections.

## Supported behavior

Discover authorized devices, inspect reported state and use declared controls.
Device capabilities depend on connected providers. The assistant discovers missing capabilities, distinguishes ambient temperature
from setpoints, and acknowledges ordinary commands without automatic polling.
A dispatch acceptance is separate from observed completion. Interactive
panels require a host supporting MCP Apps and an enabled cloud deployment.

The plugin cannot read local computer files, buy hardware, bypass MFA or device
permissions, or guarantee completion from dispatch acceptance. Cross-host
monitoring and media compatibility require their own acceptance evidence.

## Release ZIPs

Download the platform ZIP and `SHA256SUMS` from
[GitHub Releases](https://github.com/portpowered/portos-plugin/releases/latest):

- `portos-claude-<version>.zip`: native Claude plugin with `.claude-plugin/plugin.json` at its root, for Claude hosts supporting plugin ZIP installation.
- `portos-chatgpt-<version>.zip`: portable Agent Plugins package with `plugin.json` and `mcp.json` at its root, for upload at [OpenAI Plugins](https://platform.openai.com/plugins).
- `portos-codex-<version>.zip`: native Codex package with the same skills and a remote MCP config compatible with the Codex plugin loader. The public Git marketplace uses this config too.
- `portos-chatgpt-qa-<version>.zip`: private ChatGPT QA variant, with the same skills, assets and CIMD method plus a verified QA App binding and the complete standard CIMD scope set. Install this variant for account testing; never upload it for public directory review.

All four include the same skills, assets and remote service. No ZIP contains
marketplace metadata, workflows, credentials or a local server. Directory
approval and availability are separate from downloading or uploading a package.
Claude Code users can continue to install from the marketplace command above.

Maintainers configure `qa.json` with the ChatGPT-accessible QA `appId` and the
separate Portal `submissionAppId`, plus the QA `scopes`. These IDs are references, not OAuth
credentials; each tester must connect their own Port OS account. An unpublished
Portal App is not automatically available in ChatGPT. Updating the Portal draft
does not automatically update an installed private QA plugin.
Use the matching versioned QA ZIP and verify its tools in a fresh chat.

Every push to the plugin repository's main branch builds downloadable workflow
artifacts. A `v<version>` tag or a manual run of **Plugin release packages** from
main publishes the GitHub release. Both manifests must agree with the tag.
Releasing changed files requires a new manifest version; existing release
assets are verified and never overwritten.

To reproduce inside the plugin-only repository with Node.js 24.21.0:

```text
node .github/scripts/packagePluginRelease.mjs . dist
```

In the development monorepo, run `make -C plugins/portos build`. Versioned ZIPs
and checksums appear under `dist/assistant-plugins/releases/`.

## Distribution and verification

Maintainers: follow [the release procedure](https://github.com/portpowered/portos-plugin/blob/main/RELEASING.md) for local generation,
preview, the reviewed-main push to this repository, GitHub workflow artifacts,
and the separate OpenAI and Claude submission steps.

This source provides OpenAI portable and Claude native manifests over the same
cloud service and skills. The Port OS development repository validates and exports the platform packages from shared Markdown skills. Other Port OS repositories are listed at [portpowered/index](https://github.com/portpowered/index). This plugin-only distribution contains the remote connection configuration, skills and listing assets.

Public directory review is not complete. Publisher verification, provider
eligibility, policy coverage, supported regions, real host tests and reviewer
access remain release requirements. Installing this source is separate from
approval or availability in either public directory.

[Website](https://portoperatingsystem.com/) ·
[Documentation](https://portoperatingsystem.com/docs/getting-started/) ·
[Support](https://portoperatingsystem.com/contact/) ·
[Privacy](https://portoperatingsystem.com/privacy-policy/) ·
[Terms](https://portoperatingsystem.com/terms-of-service/)
