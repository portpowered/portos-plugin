# Port OS

Connect devices to AI. Automate things in your life and have your agent manage your home.

With compatible connected devices, ask your agent to clean rooms with your robot vacuum, ring a supported phone or wallet tracker, turn off lights, check batteries, inspect a camera for a package or a pet, check a supported lock's reported state, play music, control a TV, or work with your connected cloud photo library. Agents can build laundry notifications, speaker wake-ups and other scheduled or monitored routines when the required device observations, controls and agent automation are configured. The plugin does not independently detect sleep or run continuous monitoring merely because it is installed.

Port OS exposes APIs that allow agents to find your devices, check their state and control supported capabilities. Access follows the permissions you approve, with granular authorization per agent, device, person and capability.

Device support depends on the providers and capabilities connected to your account. Customers must link their own provider accounts and provide their own keys where appropriate. Port OS runs in the cloud; no local MCP server is required.

The plugin connects to `https://api.portoperatingsystem.com/mcp`. No local server is required.

## Connect

For Claude Code, install from the plugin-only GitHub repository:

```text
/plugin install portos --marketplace portpowered/portos-plugin
```

This installs skills and the cloud connection
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
Device capabilities depend on connected providers. The assistant discovers
schemas before commands, distinguishes ambient temperature from setpoints,
and reads fresh observations before claiming a command completed. Interactive
panels require a host supporting MCP Apps and an enabled cloud deployment.

The plugin cannot read local computer files, buy hardware, bypass MFA or device
permissions, or guarantee completion from dispatch acceptance. Cross-host
monitoring and media compatibility require their own acceptance evidence.

## Distribution and verification

This source provides OpenAI portable and Claude native manifests over the same
cloud service and skills. The Port OS development repository validates and exports the platform packages from shared Markdown skills. Other Port OS repositories are listed at [portpowered/index](https://github.com/portpowered/index). This plugin-only distribution contains the remote connection configuration, skills and listing assets.

Public directory review is not complete. Publisher verification, provider
eligibility, policy coverage, supported regions, real host tests and reviewer
access remain release requirements. Installing this source is separate from
approval or availability in either public directory.

[Website](https://portoperatingsystem.com/) ·
[Support](https://portoperatingsystem.com/contact/) ·
[Privacy](https://portoperatingsystem.com/privacy-policy/) ·
[Terms](https://portoperatingsystem.com/terms-of-service/)
