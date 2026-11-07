# Find rooms, groups and robot vacuums

Use group_query for room/floor/home membership, parentPath and controllers. A room group lists its controllers: each has the endpointId of a device that can act on the room and the messages it accepts there. Endpoints do not list their rooms. To find a vacuum's rooms, query group_query {"controllers": {"has": "<vacuum endpoint ID>"}}. Clarify ambiguous rooms/robots; rooms with the same name in different homes are different targets. Pages (queries without id) list ids, etags, parentPath, members, controllers and message references but omit routes; call group_query with the group id for its routes, interfaces, payload shapes and membershipComplete.

Read the documented payload fields for the exact declared endpoint/group command. For robotic vacuum clean-room ("clean the kitchen"), find the room group with group_query by name, read its controllers, pick the controller that accepts clean-room, and send control to that robot endpoint using the copied group ID in groupIds in the declared payload. Check the robotic-vacuum-cleaner interface configuration: multiple groupIds require supportsMultiRoomCleaning=true. If it is absent or false, select one room. Do not send cleaning to a room endpoint or invent a second action path. Other group controls require that the selected authorized group route advertises the message.

To show a room map or let someone pick rooms, call endpoint_show on the vacuum (the controller) with primary house-map. Its card has room picking; never draw a map or floor plan yourself from group spatial geometry, and do not read one group at a time to collect it.

After acceptance verify available fresh observations, then call endpoint_show on the robot's exact endpointId so the customer can inspect its state. Acceptance does not prove cleaning finished. When multi-room cleaning is supported, send the requested rooms in one clean-room request, in cleaning order. Robot status does not list target rooms: name those sent rather than claiming to read them back. Never automatically repeat state changes or report missing state as success. Inventory changes require separate authorization.

## Organize rooms and groups

Before group_manage changes, read [Provider synchronization and outcomes](https://portoperatingsystem.com/docs/for-ai/guides/provider-group-sync.md).
Query current group IDs, membership and etags. Every reference to one group in a
batch uses the same starting etag. MOVE_MEMBER needs the memberEndpointId and
source/target group references with both etags; an add cannot displace another
exclusive native group. Contradictory edits fail rather than following list order.

Create, delete, membership, move and rename default to providerSync BEST_EFFORT:
supported native changes run before local intent. Inspect each result and
providerDispatches; partial saves are not full synchronization, and NOT_APPLIED
can still mean a native message was sent. Provider facts survive failed customer
intent. PORTOS_ONLY sends nothing; strict FAIL_ON_PROVIDER_ERROR and exact-key
retries are explained in the linked protocol. Native effects cannot be rolled back.

DELETE_GROUP may delete native groups. Unretired routes become disabled orphans;
rediscovery cannot resurrect the deleted group. Explicitly re-enable a retained
native source before an exclusive move. Merge and enablement are PORTOS_ONLY;
rename never automatically merges groups. Obtain authorization for exact delete
or merge targets and effects.

Hue supports create/delete/membership/rename; rooms are exclusive, zones are not.
Roborock supports room rename only; membership edits do not reshape its map.
Sonos native mutations are deferred. Declared support and outcomes are authoritative.

## Bounded Roborock movement

- [ ] For "move the Roborock forward", "explore my house", "go to the kitchen" or "go back home", distinguish remote driving, navigation, cleaning and docking. Inspect the declared remote-control messages and read the cameras guide. The feedback loop for a tool-only agent is a fresh pose plus a fresh camera snapshot after each short bounded move: read spatial/pose with forceDeviceAttributeQuery, then request snapshot/get-snapshot with responseFormat BASE64 and look at the image. Live video is optional: use it when your client can render it, but its absence never blocks driving.
- [ ] Drive with the four remote-control messages only: start-session, move, stop-session and end-session, in this order. Send start-session and every move with waitForResult true: each finishes before it returns (start-session once the robot reports remote control, which takes up to 30 s for a docked robot that first drives off its dock and fails with PROVIDER_TIMEOUT if it never does; a move after its whole motion), so SUCCEEDED means the robot has finished and the next pose read is after the motion. Never send them with waitForResult false: you would get QUEUED and no evidence. Read spatial/pose with forceDeviceAttributeQuery after start-session (the real starting position and heading) and after each move, take a snapshot to verify, then end-session. Undocking leaves the robot facing away from the dock, so turning 180 degrees faces it again. A move sent outside a session fails with remote_control_not_active.
- [ ] Send each move once with the exact fields. velocity is meters per second (-0.3 to 0.3; positive forward, negative reverse; use 0.2 or less), omega is radians per second (-0.8 to 0.8; positive turns left, counter-clockwise from above) and duration is in milliseconds, a multiple of durationIncrement (1000 for the Roborock) between minDuration and maxDuration (1000 to 5000); anything else is rejected. seqNum starts at 1 after start-session and must increase on every move; a repeated number is ignored. Worked examples: turn 90 degrees left is omega 0.785 for 2000 ms; turn 180 degrees is omega 0.785 for 4000 ms (negative omega turns right); about 1 m forward is velocity 0.2 for 5000 ms; angle is omega x seconds and distance is velocity x seconds, so confirm with a pose read. Heading is degrees from 0 to 360: 0 faces the map's positive x axis, 90 faces positive y, and a positive omega raises it. The robot's front faces the heading and the camera looks that way. The route's interface configuration reports the bounds as minVelocity, maxVelocity, minOmega, maxOmega, minDuration, maxDuration and durationIncrement; a move outside them is rejected before the robot is contacted.
- [ ] SUCCEEDED on a move means the robot finished the motion, not that it travelled the distance: obstacle avoidance can stop it early, and it may ignore a move near walls or the dock or right after a camera request. Verify the outcome by reading spatial/pose with forceDeviceAttributeQuery and by taking a fresh snapshot; a pose that did not change means the move was ignored, so resend it once or change direction. Never enlarge the duration to force a result.
- [ ] A session ends by itself after about 30 seconds without a move (measured on a Roborock S8), and the robot stays where it is. Agents often pause longer than that between calls, so before a move after any pause read remote-control/session with forceDeviceAttributeQuery and send start-session again when it is INACTIVE; a move sent to a lapsed session fails with remote_control_not_active. stop-session halts motion and keeps the session (the 30 s idle limit still applies). end-session leaves remote control and returns the robot to normal operation. End the session after success, failure or cancellation. Neither command requests docking, although a robot vacuum may return to its dock on its own after end-session.
- [ ] The pose names the room the robot is in: spatial/pose containedInRoomGroupRouteId is the same route id the room carries in group_query. The Roborock charger is in the Laundry, so a docked robot reports the Laundry. Room geometry (group_query expand spatial) drops map-noise islands and holes under 0.05 square metres; read a room's shape from the same frame as the pose.
- [ ] Do not leave a session active. After ending it, use the declared return-to-dock command if requested and verify fresh docking/charging state.

Room cleaning does not navigate without cleaning. Only use a declared navigation operation for "go to the kitchen"; the current Roborock integration has none. Missing Kitchen membership is not permission to guess another room or coordinates. Explain the limitation and offer supported short remote moves only when a fresh pose and snapshot are available. "Go back home" uses the declared vacuum return-to-dock command after ending remote control; verify fresh docking/charging state instead of equating acceptance with arrival. Unavailable snapshots, including a blocked camera, prevent visually guided exploration; do not improvise an unseen route. Live video is not required.
