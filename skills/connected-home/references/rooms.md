# Find rooms, groups and robot vacuums

Use group_query for room/floor/home membership and parentPath. Use endpoint_query for the requested robot vacuum or other controller and its controllableGroups. Clarify ambiguous rooms/robots; rooms with the same name in different homes are different targets.

Read the documented payload fields for the exact declared endpoint/group command. For robotic vacuum clean-room, send control to the robot endpoint whose controllableGroups contains the requested room, using copied groupIds in the declared payload. Check the robotic-vacuum-cleaner interface configuration: multiple groupIds require supportsMultiRoomCleaning=true. If it is absent or false, select one room. Do not send cleaning to a room endpoint or invent a second action path. Other group controls require that the selected authorized group route advertises the message.

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

- [ ] For "move the Roborock forward", "explore my house", "go to the kitchen" or "go back home", distinguish remote driving, navigation, cleaning and docking. Inspect the declared remote-control messages and read the cameras guide. Establish working, advancing live video before moving.
- [ ] Prefer unary-move with one short instruction. The integration starts one session, waits for native manual/remote mode with error code zero, allows five seconds of firmware startup settling, and requires one fresh healthy manual-mode reading before moving. Lost mode or cancellation prevents movement and triggers bounded cleanup.
- [ ] Use velocity in meters per second (-0.3 to 0.3), omega in radians per second (-0.8 to 0.8), and duration in milliseconds (1â€“5000). A 300 ms movement remains 300 ms; the startup delay does not lengthen motion. Unary-move assigns sequence numbers and ends its session after the requested movements.
- [ ] Treat acceptance as dispatch evidence, not proof of movement. Inspect the resulting live view before continuing. If the outcome is uncertain, stop and inspect; never automatically repeat a move or enlarge its duration to force a result.

## Explicit start, move and end

- [ ] Keep one robot and provider route throughout the session. start-session acknowledges the native start command; its acknowledgement alone does not establish movement readiness.
- [ ] Advanced callers using explicit start-session/move must verify native manual/remote state and error code zero, allow five seconds of startup settling, then check native readiness again once before moving. A projected RUNNING observation alone cannot distinguish manual mode from cleaning. When native readiness cannot be verified, use unary-move, which owns these checks.
- [ ] Send each bounded move once with an increasing non-negative seqNum; begin a new session at 1. Use the exact documented payload fields instead of guessing units or field names.
- [ ] stop-session stops movement; end-session exits remote-control mode. Explicit callers own cleanup: stop when feedback is lost or an outcome is uncertain, then end the session even after a failed/canceled operation, using a separate bounded cleanup context where applicable. Neither command requests docking.
- [ ] Do not leave an explicit session active or mix direct move commands with a unary-move session. After cleanup, use the declared return-to-dock command if requested and verify fresh docking/charging state.

Room cleaning does not navigate without cleaning. Only use a declared navigation operation for "go to the kitchen"; the current Roborock integration has none. Missing Kitchen membership is not permission to guess another room or coordinates. Explain the limitation and offer supported short remote moves only when visual feedback is available. "Go back home" uses the declared vacuum return-to-dock command after ending remote control; verify fresh docking/charging state instead of equating acceptance with arrival. Unavailable visual feedback, including a blocked camera, prevents visually guided exploration; do not improvise an unseen route. Missing snapshot support alone does not block movement when advancing live video is available.
