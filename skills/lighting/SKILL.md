---
name: lighting
description: Use this guide to turn lights off or on, dim lights, check lighting state, and save or recall a room lighting scene. It covers native provider groups, finding the right lights, and telling lights from switches and plugs.
metadata:
  title: Control lights
  guide-id: lighting
  capabilities: power brightness color color-temperature scene
  content-authorship: HUMAN_MIXED_WITH_AI
  author: Port OS Team
  last modified: 2026, october, 28
---

# Control lights

1. Reuse established lighting scope and declarations; discover only missing context.
2. Prefer one compact query for the whole home or the resolved logical lighting group for a room.
3. Send once with `waitForResult: false`, acknowledge accepted/pending and stop.

## Before you start: what does "all lights" mean?

Confirm whether "all lights" means your whole inventory, current room or a named group, and apply that scope consistently. Include switches/plugs known to power lamps; a `LIGHT`-only filter can miss them.

## Lights, switches and plugs

Discover authorized endpoints and inspect their declarations. Resolve ambiguous rooms by full ID and group path. Power support alone does not make a plug or switch a light.

## Lights in someone else's home

Shared lights are excluded by default. Include them with an explicit owner, endpoint ID or group selector.

## Fix confusing data

For requested inventory cleanup, label lamp plugs `LIGHT` or disable broken devices to hide them from default results.

## Use MCP

Connect your AI client with the steps in [How to use MCP](https://portoperatingsystem.com/docs/how-to-use-mcp/). Then ask your assistant to do the work, or call these tools directly:

- `endpoint_query` lists devices. It returns each device's type, capabilities and message IDs. Call it without a `query` to load everything, or narrow it with a type filter such as `{"type": {"eq": "LIGHT"}}`. Pass the returned `nextToken` back until none is returned. Ask for `expand: ["power"]` to read power state, and add `forceDeviceAttributeQuery: true` to read it from the device instead of the cache.
- `group_query` lists groups, their parent path, child groups and members. Use it to resolve a room to a full group ID and inspect its declared controls. A group-only search misses ungrouped lights. A name such as "Everywhere" does not establish lighting coverage; inspect the actual members and capabilities.
- `control` sends a command with a unique `idempotencyKey` for the intended action. Choose exactly one target: copy `id` from discovery for a specific device or group, or use `query` with the same field-first filter as `endpoint_query`. Copy the declared `message`, for example the `turn-off` message of the power capability, and send `payload: {}`. A color uses `set-color` with `{"color":{"hue":240,"saturation":100,"brightness":100}}`: hue in degrees (0 to 360), saturation and brightness in percent (0 to 100). That example is blue.
- `endpoint_show` shows a device's card when the user asks for a card or controls. Do not automatically show cards or reread state after ordinary commands. State questions and explicit verification use a fresh query with `forceDeviceAttributeQuery: true`; describe only observed state. Never draw your own card.
- `endpoint_manage` repairs data. Its operations are `RENAME`, `SET_TYPE`, `SET_ENABLEMENT`, `MERGE_INTO` and `DELETE`. Copy the full endpoint ID from `endpoint_query`, and understand the effect before you merge or delete. A simulator endpoint can merge only into a target without a simulator route; merging two simulator endpoints returns 409 CONFLICT, so disable or delete the duplicate instead.
- `group_manage` creates, renames, merges and deletes groups, and changes their members.

Check the results to see which lights were selected, which commands were accepted, and which failed.

Address the complete logical group. Port OS selects compatible native or equivalent member delivery after checking membership. Native capabilities and `membershipComplete` do not prove coverage. Agents supply target, message and payload; Port OS selects routes for scenes and media too.

For a whole-house command, prefer one compact `control.query` rather than copied ID lists, a group-plus-leftovers sequence or per-light loops. When the established scope identifies LIGHT and SWITCH as physical lighting only, use `{"type":{"in":["LIGHT","SWITCH"]}}`. Otherwise combine LIGHT with known lamp-switch predicates. Exclude simulators, provider SELF/catalog records, appliances and duplicate physical representations. Query adds no implicit exclusions; arbitrary switches/plugs are not lights. Discover only missing scope, following every relevant result page. Report unresolved coverage rather than silently narrowing it. Backend routing can use native groups internally.

Use `waitForResult: false` for ordinary power, brightness and color writes. Report acceptance or pending status without claiming the physical state changed; do not automatically poll, fresh-read or open cards. Use `true` for requested replies such as scene creation, and fresh-query only for requested verification or uncertain-outcome diagnosis. QUEUED/IN_PROGRESS can have empty lists. After ambiguous transport failure, including HTTP 404, never automatically repeat `control`: even the same key can dispatch anew without a receipt. An authorized retry retains the key and all arguments, including wait mode.

### Save and recall a room scene

Read [Save and recall room scenes](https://portoperatingsystem.com/docs/for-ai/guides/room-scenes.md) for the complete native-room selection, scene capture, activation and verification workflow.

## Use the HTTP API

Authorize with a bearer token that has the endpoint and message permissions you need. See [authorization rules](https://portoperatingsystem.com/docs/for-ai/guides/authorization-rules.md).

### Find lights

For one bulb, read its power, brightness and color message schemas in [the capability directory](https://portoperatingsystem.com/docs/for-ai/capability-interfaces.md). Use the exact namespace, version, message name, units and constraints it returns. [The quickstart](https://portoperatingsystem.com/docs/for-ai/guides/quickstart.md) shows the generic message envelope.

For "all lights", call [endpointQuery](https://portoperatingsystem.com/docs/for-ai/operations/endpointQuery.md) with `endpoint:read` permission and filter by the `LIGHT` type:

```json
{
  "query": {
    "match": {"key": "type", "value": "LIGHT"}
  },
  "paginationContext": {"maxResults": 25}
}
```

Type-only queries return the caller's own endpoints. To include a shared endpoint, add an explicit owner or endpoint ID selector. A group selector can include shared members once `group:read` and group access checks pass.

For a room, first resolve its full group ID with [group discovery](https://portoperatingsystem.com/docs/for-ai/guides/managing-groups.md). Then add `{"match":{"key":"groupId","value":"<resolved-full-group-id>"}}` to the `and` list of the query. This also requires `group:read` and permission to read that group. A group filter returns the group's member endpoints. Resolve nested groups as needed and remove duplicate endpoint IDs. Reading a group does not grant control of its members.

Repeat the same query, page size and authenticated grant with `paginationContext.nextToken` from each response. Continue until the token is absent, including after an empty page. Disabled endpoints are excluded by default. Check each selected endpoint's declared capabilities, and drop targets that do not support power. Do not widen the selection to every plug or switch. Freeze the target list before you send commands, and report each result.

### Read state

To read live state, call [endpointQuery](https://portoperatingsystem.com/docs/for-ai/operations/endpointQuery.md) with `expand: ["interfaces.attributes"]` and `forceDeviceQuery: true`. The same options exist on `GET /endpoints`: send `id=<endpoint-id>`, `expand=interfaces.attributes` and `forceDeviceAttributeQuery=true`. Check each observation's sample time and any partial errors before you say a light changed.

A batch can partly succeed. Report selected, accepted, failed and unresolved targets separately. A lost response is not a reason to repeat a relative brightness change.

### Control lights

Send each command with [upsertMessageRequest](https://portoperatingsystem.com/docs/for-ai/operations/upsertMessageRequest.md): `POST /message-requests` with a unique `Idempotency-Key` for this intended command, with the target endpoint and a message that names the capability namespace, message name and version. To turn a light off:

```json
{
  "target": {
    "type": "ENDPOINT",
    "id": "<full-endpoint-id-from-discovery>"
  },
  "message": {
    "header": {
      "namespace": "port1/systems/zero/capability-interfaces/power",
      "name": "turn-off",
      "version": "1.0"
    },
    "body": {}
  }
}
```

Inspect the returned request's `id`, `status`, `results` and `errors`. `FIRE_FORGET` can return `QUEUED` before any provider call. Use `responseType: "SYNC"` to wait for final delivery outcomes, or poll `GET /message-requests/{id}`. A provider response, when present, is in `results[i].message`. Pending deliveries appear in neither list. Delivery success does not prove the light is off; read the state again to confirm.

A request can target `{"query": <the shared Query AST>}` instead of type/id. Port OS freezes authorized recipients once; zero or more than 100 returns 400. The same key and arguments attach to an existing request despite inventory changes; without a receipt, POST can dispatch anew. Inspect receipts or state instead of automatic retries. Never use a new key to repeat uncertain relative brightness. `TIMED_OUT` means unknown outcome.
