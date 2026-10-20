# Work with lights and lamps

For "turn off the lights", "dim the bedroom lamp" or "are the lights on?":

1. Discover matching names/rooms and inspect power/brightness capabilities. A lamp may be typed LIGHT, SWITCH or PLUG, so an exact LIGHT-only filter can miss it. A PLUG controlling an unrelated appliance is not automatically a light. Exclude generic plugin endpoints; simulator devices do not establish the customer's household light state.
2. If a room/group is requested use group_query to resolve membership; do not assume a room name matches every endpoint name. Follow pagination and choose the requested scope. Clarify only if the target/scope remains ambiguous.
3. Query the exact endpointId. Copy the declared power/brightness command ID and use its documented payload fields; do not guess an on/off boolean or brightness range. Use control on the chosen endpoint/authorized group and preserve routeId when selecting a provider.
4. After an accepted command, query the exact endpoint with expand:["power","connectivity"] and forceDeviceAttributeQuery:true when both are declared. Add brightness for a dimming request. Report confirmed observations, not dispatch acceptance, as the outcome.
5. An available UNREACHABLE reading means offline even if an old power value says ON/OFF. Missing or unavailable readings do not mean OFF. Report an unconfirmed outcome if verification fails. Never automatically repeat a state-changing command after acceptance or timeout.

Read-only light state questions need endpoint_query, not control. Editing names/groups belongs in endpoint_manage/group_manage and is a separate user task.
