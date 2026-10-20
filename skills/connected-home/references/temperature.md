# Thermostat and current indoor temperature

For "lower the temperature" or "what's the temperature right now?", determine whether the user means indoor/device temperature or outdoor weather. If context does not decide, ask which; do not silently substitute weather for a connected-home reading.

1. Read-only discovery: endpoint_query for thermostats and temperature-sensor capabilities, with focused room/name queries and pagination. If the host exposes multiple authorized accounts, inspect likely home-device connections before declaring a sensor absent. Keep each account's IDs separate. Ask which room/device if several match.
2. Current temperature means the temperature-sensor ambient reading, not a thermostat setpoint. Read the exact endpoint with declared temperature-sensor/connectivity expansion and forceDeviceAttributeQuery:true. Report available value and units; stale/unavailable readings cannot establish current temperature. Do not infer a temperature from mode, a target or weather.
3. For control, read the exact endpointId and copy the route and declared thermostat command. Clarify desired target or relative amount and units when missing. A relative change uses an available current setpoint, not ambient temperature; if unavailable, ask for an explicit target. Use the documented payload fields; the backend validates the request.
4. Send once and verify fresh thermostat observations. A changed setpoint does not mean the room has already cooled. Accepted dispatch without available verification is unconfirmed; never automatically repeat the change.
