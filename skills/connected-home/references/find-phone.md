# Ping or find a phone

For "ping my phone", "ring my phone" or "find my phone", use Port OS's connected Find My device, not a network ping or a guessed messaging tool.

1. Find phone/iPhone names with endpoint_query. Inspect providerName, routes and location-tracker/location capabilities. Prefer the requested provider's current route-backed record over obsolete duplicates. TRACKER may represent a phone. If multiple distinct phones remain, ask which one.
2. "Ping/ring my phone" requests an audible locator. Query the exact endpointId, copy the declared location-tracker command, then send control once on that endpoint/route. iCloud declares start-locator; never invent play-sound or another provider-specific message. An accepted result means the locator was requested, not that the sound was heard. Report that distinction; do not retry automatically.
3. "Find my phone" usually requests help locating it. If a location capability is declared, read the copied exact endpoint with expand:["location","connectivity"] and forceDeviceAttributeQuery:true. Relay an available location and its supplied timestamp; stale data is last-known, not current. Do not claim missing coordinates mean the phone is lost/offline. If a sound would help and location is unavailable, offer to ring it or ask whether the user wants location or sound; do not silently replace an unsuccessful location read with a physical action.
4. A specifically requested ping can be sent without reading precise location. A battery question needs the battery guide and no locator command. If connectivity is available and UNREACHABLE, report the phone offline; command rejection must not be reported as a successful ring. Do not infer a depleted battery from offline alone.

Respect the user's requested target and scope. Avoid copying precise location, account IDs or signed resources into diagnostics. Account authorization errors require connection recovery/sign-in, not guessing new device IDs.
