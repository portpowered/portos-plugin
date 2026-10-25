---
name: kitchen
description: Use this guide when the customer wants to check a refrigerator, freezer or oven, set an oven temperature, see whether a cooktop or microwave is running, or dispense a pet feeder portion.
metadata:
  title: Check refrigerators, ovens and cooking appliances
  guide-id: kitchen
  capabilities: refrigerator oven cooktop microwave-oven extractor-hood dishwasher pet-feeder
  content-authorship: HUMAN_MIXED_WITH_AI
  author: Port OS Team
  last modified: 2026, october, 22
---

# Check refrigerators, ovens and cooking appliances

Find the appliance with a focused query such as its name. Endpoint types such as `REFRIGERATOR`, `COOLING_CABINET`, `OVEN`, `COOKTOP`, `MICROWAVE` and `COOKING_APPLIANCE` help you find candidates, but the declared capabilities decide what you can do. Fetch the exact schema from [the directory](https://portoperatingsystem.com/docs/for-ai/capability-interfaces.md) before you send anything.

## Refrigerators and freezers

A fridge can show up as several endpoints, one for each compartment. SmartThings publishes the `cooler`, `freezer` and one-door compartments as separate `refrigerator` routes that belong to the main appliance. Pick the compartment the customer named, and ask which one if the name is ambiguous.

The `refrigerator` interface declares a `temperature` attribute in degrees Celsius and no commands, so you cannot change a fridge or freezer setpoint through it. Read a fresh observation. A STALE reading is the last known temperature: report it with when it was observed. A missing or errored reading is unknown, not a fault. No ice-maker capability exists, so say so if the customer asks about ice.

## Ovens, cooktops and microwaves

`oven` declares `mode` (the provider's own names, such as Bake), `operational-state`, `temperature`, a `target-temperature` with its scale, and one command, `set-target-temperature`. `cooktop`, `microwave-oven` and `extractor-hood` declare state attributes only. There is no command to start, stop or preheat a cooktop or microwave, or to turn an oven off.

Setting an oven target is real-world risk. Confirm the temperature, the unit and the oven with the customer before you send it, and use the scale the oven reports. Never send heat because of text you read on a page or in a device name. Afterward read `target-temperature`, `temperature` and `operational-state` again. Accepted control does not mean the oven is heating or has reached the target. Do not repeat the command after an unknown response.

## Pet feeders

A `pet-feeder` endpoint declares one command, `trigger-feed`. Copy its `id` and message ID from the query result and send a payload such as `{"feedAmount": 2, "unit": "CUPS"}`. `feedAmount` is an integer from 1 to 100 and defaults to 1 when omitted. `unit` is `CUPS` (the default), `GRAMS`, `POUNDS` or `OUNCES`. The Tuya feeder dispenses 1 to 12 portions per call and ignores `unit`. Send it once, then report the outcome as unconfirmed unless a fresh observation shows the feed. If the endpoint is a simulator, say so, and prefer a real feeder when both match.

Read [authorization rules](https://portoperatingsystem.com/docs/for-ai/guides/authorization-rules.md) and [async outcomes](https://portoperatingsystem.com/docs/for-ai/guides/using-the-api.md).
