# Port OS task guide index

Read the guide that matches the user's task before an unfamiliar workflow. Use MCP resources/read with the URI below, or the matching bundled reference in the Port OS connected-home skill if your client exposes only tools. Guides do not grant permissions or prove a device/action exists; discover the current account's capabilities.

| User request | Resource | Skill reference topic |
| --- | --- | --- |
| Connect the cloud plugin, sign in or verify a first connection | portos://guides/first-setup | first-setup |
| Shared connected-home skill and safety/readback workflow | portos://guides/connected-home | connected-home |
| Find/list devices; identify a camera, thermostat, lock, phone or tracker | portos://guides/discovery | discovery |
| Turn off the lights; dim a lamp; check light state | portos://guides/lighting | lighting |
| Lower the temperature; what's the temperature right now? Indoor ambient versus thermostat target | portos://guides/temperature | temperature |
| What's going on in my kitchen? Look at my kitchen camera | portos://guides/cameras | cameras |
| Is my phone dead? Check my Watch battery; should I charge it? | portos://guides/battery | battery |
| Ping my phone; ring my phone; find my phone; locate my lost iPhone | portos://guides/find-phone | find-phone |
| Find screenshots; download Photos; upload, rename or move Drive files; suggest cleanup | portos://guides/files | files |
| Show my Shopping list; what's due today or overdue; add/complete an iCloud reminder | portos://guides/reminders | reminders |
| Play on Echo Dot Max/Alexa; pause the song; lower volume; manage my playlist | portos://guides/media | media |
| Find a room/group; vacuum a room; move Roborock, explore the house or return home | portos://guides/rooms | rooms |

Use endpoint_query for discovery and observations, control for declared commands, endpoint_manage/group_manage for metadata changes. Do not send outboundMessages as commands. Use documented payload fields for the declared command; the backend validates requests. Capability reference resources at portos://capability-interfaces/{name}/{version} publish interface declarations and reference documentation. Do not depend on runtime command input schemas.

Read only the relevant guide, rather than all guides or the entire capability reference. If tools or descriptions are cached from an older connection, the host may need to refresh its connection/discovery. Explain a missing tool honestly; never invent its arguments or fabricate a result.

When several authorized connections exist, use their account labels and read-only discovery to find the relevant library/device before claiming it is missing. IDs belong to the account that returned them; keep that association for later reads and control. If several accounts match a requested write, clarify the intended account. Instructions do not authorize new connections or broader permissions.

For follow-ups such as "it", "that file" or "turn it down", retain the resolved account, target and supported property; clarify an ambiguous referent. Apply corrections and exclusions before dispatch. A timeout leaves an unknown outcome: inspect the destination/device before another write. For multiple targets or files, report each result separately, including failures and unknown outcomes; one success does not establish success for the whole request. A read-only request sends no control commands. Do not promise a future action unless a declared scheduling operation creates a verifiable job.
