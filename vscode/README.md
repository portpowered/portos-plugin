# Port OS Smart Home MCP

Control your smart home from GitHub Copilot and VS Code agent mode. Port OS Smart Home MCP adds the hosted Port OS MCP server to VS Code, so your AI agent can find your devices, read their state and control lights, thermostats, vacuums, locks, speakers and TVs from Philips Hue, Sonos, SmartThings and many other providers.

Port OS runs in the cloud. There is no local server to install, no command to run and no API key to paste into a config file.

## What you can do

Ask Copilot in agent mode things like:

1. Show my connected devices.
2. Turn off the lights.
3. Set the temperature to 21 degrees.
4. Run the vacuum in the living room.
5. Check if the doors are locked.
6. Play a song on Spotify on the TV.
7. Set an audio reminder on my speakers.
8. Check my calendar and display it on the TV.

Port OS also exposes cameras, sensors and groups of devices, and shows interactive device cards in hosts that support MCP Apps.

## Install

1. Install **Port OS Smart Home MCP** from the Visual Studio Marketplace, or run `ext install portos.portos-smart-home-mcp` in the command palette.
2. Reload VS Code if prompted.

Requires VS Code 1.101 or later with GitHub Copilot Chat.

## Connect

1. Click **Connect** on the notification that appears after install, or run **Port OS: Connect Smart Home MCP** from the command palette.
2. VS Code asks to trust the server and to let it sign in. Allow both; your browser opens to sign in to Port OS with Google or a Website sign-in access key.
3. Back in VS Code, click **Open Agent Chat**, or open Copilot Chat in **Agent** mode yourself. **Port OS Smart Home** is listed under MCP servers in the tools picker and in **MCP: List Servers**.
4. Review and approve the permissions. Access follows the permissions you approve, per agent, device, person and capability.
5. Link your own provider accounts (Philips Hue, Sonos, SmartThings and others) in your Port OS account, completing any provider sign-in there.
6. Ask "Show my connected devices" to verify discovery without controlling anything.

You can revoke access at any time from your Port OS account.

## Supported providers

Device support depends on the providers connected to your account. Port OS works with Philips Hue, Sonos, SmartThings and Samsung devices, Google Nest, Spotify, Ring, Roborock, Alexa, Tuya, iCloud and more.

## Limits

Port OS cannot read local computer files, buy hardware, bypass multi-factor authentication or device permissions, or guarantee that a command finished from its acceptance alone. Unlocking doors asks for your explicit confirmation first.

## Privacy and support

The extension declares the hosted server `https://api.portoperatingsystem.com/mcp` and adds the Connect command that starts it. It runs no other code and collects no telemetry.

[Website](https://portoperatingsystem.com/) ·
[Support](https://portoperatingsystem.com/contact/) ·
[Privacy](https://portoperatingsystem.com/privacy-policy/) ·
[Terms](https://portoperatingsystem.com/terms-of-service/) ·
[Report an issue](https://github.com/portpowered/portos-plugin/issues)
