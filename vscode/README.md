# Port OS Smart Home MCP

Control your smart home from GitHub Copilot and VS Code agent mode. Port OS Smart Home MCP lets you control your lights, thermostats, vacuums, locks, speakers and TVs from Philips Hue, Sonos, SmartThings and many other providers.

Port OS runs in the cloud. To connect your devices to Port OS, and through it to GitHub Copilot, follow **Set up your devices** below. Once your devices show up in [Your devices](https://portoperatingsystem.com/dashboard/), you're ready to connect VS Code.

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

## Set up your devices

1. Go to [portoperatingsystem.com](https://portoperatingsystem.com/) and sign in.
2. Open the [plugin catalog](https://portoperatingsystem.com/plugins/) and add the plugins for your providers, such as Philips Hue, Sonos or SmartThings. Sign in to each provider on its own page; Port OS never sees your provider password.
3. Open [Your devices](https://portoperatingsystem.com/dashboard/). If your devices are listed there, you're good to go.

## Install

1. Install **Port OS Smart Home MCP** from the Visual Studio Marketplace, or run `ext install portos.portos-smart-home-mcp` in the command palette.
2. Reload VS Code if prompted.

Requires VS Code 1.101 or later with GitHub Copilot Chat.

## Connect

To activate this MCP server:

1. Go to the **Agents** tab in VS Code and click the configuration button.
2. Click **Start** on **Port OS Smart Home** to activate it. You can also click **Port OS: Connect** in the status bar, or run **Port OS: Connect Smart Home MCP** from the command palette.
3. VS Code asks to let the server sign in. Click **Allow**; your browser opens to sign in to Port OS with Google or a Website sign-in access key.
4. Review and approve the permissions. Access follows the permissions you approve, per agent, device, person and capability.
5. Back in VS Code, open Copilot Chat in **Agent** mode and ask "Show my connected devices" to check that Copilot sees the same devices as your dashboard, without controlling anything.

If VS Code shows a 401 or "unauthorized" error for the server, usually after an extension update, run **Developer: Reload Window** from the command palette, then click **Start** on **Port OS Smart Home** again. You stay signed in. If it still fails, run **Authentication: Remove Dynamic Authentication Providers**, remove the Port OS entry, and click **Start** to sign in again.

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
