# Work with lights and lamps

For "turn off the lights", "dim the bedroom lamp" or "are the lights on?":

1. Reuse established names, lighting scope and power/brightness declarations; discover only missing context. Lamps may be LIGHT, SWITCH or PLUG; include only known lamp controls. Exclude provider catalog entries, simulators, appliances and duplicate physical representations.
2. Resolve requested rooms with group_query, follow pagination and inspect membership rather than matching endpoint names. Port OS selects native or equivalent member delivery for the complete logical group. Native capabilities and membershipComplete do not prove aggregate coverage. Clarify ambiguous scope.
3. Prefer one control call: the resolved logical lighting group for a room, or a compact field query for the whole home. If LIGHT and SWITCH are known to contain only physical lighting, use query:{"type":{"in":["LIGHT","SWITCH"]}}. Otherwise combine LIGHT with the known lamp-switch predicates. Avoid copied ID lists and per-light loops; a group-only search misses ungrouped lights. Copy the declared command and payload. Blue set-color is {"color":{"hue":240,"saturation":100,"brightness":100}}: hue 0–360 degrees, saturation/brightness 0–100 percent. Backend route selection covers the complete target.
4. Ordinary power, brightness and color writes use waitForResult:false. Report accepted/pending and stop. Do not automatically poll, query state or open cards. If the customer asks whether lights are off or requests verification, query once with the declared expansions and forceDeviceAttributeQuery:true; claim only the fresh state actually observed. Show cards only when requested.
5. UNREACHABLE or ENDPOINT_UNREACHABLE (423) means offline/rejected despite old power values. Missing readings do not mean OFF. PROVIDER_NO_STATE means unknown, not offline: send the requested command once, then report unconfirmed if verification fails. Never skip it or claim OFF from missing state, or automatically repeat writes after acceptance/timeout.

Read-only light state questions need endpoint_query, not control. Editing names/groups belongs in endpoint_manage/group_manage and is a separate user task.

After ambiguous transport failure (including HTTP 404), never automatically repeat control: even the same key can dispatch anew without a receipt. Read a known receipt via authorized GET /message-requests/{id} or fresh-read state. An authorized retry retains the key and exact arguments.

## Save and recall a room scene

1. Read group_query with expand:["scene"] and forceDeviceAttributeQuery:true. Inspect native scene messages and available-scenes; similar room names do not make provider routes interchangeable.
2. To recall an existing scene, copy its ID into the declared scene/activate message: payload {"sceneId":"<scene ID>"}. Preserve the selected logical group ID; Port OS resolves the provider. Resolve provider ambiguity before another control.
3. To create a scene, first set the requested member light settings and verify them. If the group declares scene/create-scene, send payload {"name":"<scene name>"} with waitForResult:true. It saves a snapshot of the current member settings without activating it. The correlated scene-created result returns sceneId and name. Philips Hue scene names are limited to 32 characters; every member must have readable, reachable state. Unsupported creation is not permission to invent a message or silently save only a local label.
4. Fresh-read available-scenes to confirm the saved scene. Change the lights only as requested, then activate using the returned sceneId. Verify each affected light through fresh power/brightness and supported color observations. A scene label or accepted recall alone does not establish the physical outcome.
5. If creation times out or fails after dispatch, inspect the room's available-scenes before another write. Never automatically retry creation, substitute another room, or delete existing scenes to make space.
