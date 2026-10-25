---
name: thermostats
description: Use this guide when the customer wants to read or set a thermostat target, mode or temperature.
metadata:
  title: Control thermostat settings
  guide-id: thermostats
  capabilities: thermostat temperature-sensor
  content-authorship: HUMAN_MIXED_WITH_AI
  author: Port OS Team
  last modified: 2026, october, 25
---

# Control thermostat settings

Discover the intended thermostat and its declared capabilities from [the directory](https://portoperatingsystem.com/docs/for-ai/capability-interfaces.md). Retrieve the exact setpoint/mode schema before sending. Preserve declared units, supported mode names and temperature bounds; never assume Celsius/Fahrenheit.

## Use MCP

- `endpoint_query` finds the thermostat. Ask for its thermostat and temperature-sensor expansions with `forceDeviceAttributeQuery: true`. The room temperature is the temperature-sensor reading, never the setpoint.
- `control` sends the declared setpoint or mode command with its documented payload. For a relative change such as "a bit warmer", start from a fresh current setpoint, and ask for a target when none is available.
- After the command, read the thermostat again the same way, then call `endpoint_show` with its exact endpoint ID so the customer sees the new setpoint next to the room temperature. Answer in a sentence or two next to the card; never draw your own card.

## Use the HTTP API

Use [authorized REST dispatch](https://portoperatingsystem.com/docs/for-ai/guides/quickstart.md). Read fresh mode/setpoint/temperature observations after the command. A committed target setting does not prove the room has reached that temperature. Report delayed or unavailable observations honestly and do not repeat relative adjustments after an unknown response.

