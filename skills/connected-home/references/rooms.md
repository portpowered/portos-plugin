# Find rooms, groups and robot vacuums

Use group_query for room/floor/home membership and parentPath. Use endpoint_query for the requested robot vacuum or other controller and its controllableGroups. Clarify ambiguous rooms/robots; rooms with the same name in different homes are different targets.

Read the documented payload fields for the exact declared endpoint/group command. For robotic vacuum clean-room, send control to the robot endpoint whose controllableGroups contains the requested room, using copied groupIds in the declared payload. Check the robotic-vacuum-cleaner interface configuration: multiple groupIds require supportsMultiRoomCleaning=true. If it is absent or false, select one room. Do not send cleaning to a room endpoint or invent a second action path. Other group controls require that the selected authorized group route advertises the message.

After acceptance verify relevant available fresh observations. Acceptance is not proof that cleaning finished. Do not automatically repeat state-changing commands or report missing state as success. Rename, membership, enablement and merge operations use group_manage/endpoint_manage as a separately authorized metadata task.

## Bounded Roborock movement

- [ ] For "move the Roborock forward", "explore my house", "go to the kitchen" or "go back home", distinguish remote driving, navigation, cleaning and docking. Inspect the declared remote-control messages and read the cameras guide. Establish working, advancing live video before moving.
- [ ] Prefer unary-move with one short instruction. The integration starts one session, waits for native manual/remote mode with error code zero, allows five seconds of firmware startup settling, and requires one fresh healthy manual-mode reading before moving. Lost mode or cancellation prevents movement and triggers bounded cleanup.
- [ ] Use velocity in meters per second (-0.3 to 0.3), omega in radians per second (-0.8 to 0.8), and duration in milliseconds (1–5000). A 300 ms movement remains 300 ms; the startup delay does not lengthen motion. Unary-move assigns sequence numbers and ends its session after the requested movements.
- [ ] Treat acceptance as dispatch evidence, not proof of movement. Inspect the resulting live view before continuing. If the outcome is uncertain, stop and inspect; never automatically repeat a move or enlarge its duration to force a result.

## Explicit start, move and end

- [ ] Keep one robot and provider route throughout the session. start-session acknowledges the native start command; its acknowledgement alone does not establish movement readiness.
- [ ] Advanced callers using explicit start-session/move must verify native manual/remote state and error code zero, allow five seconds of startup settling, then check native readiness again once before moving. A projected RUNNING observation alone cannot distinguish manual mode from cleaning. When native readiness cannot be verified, use unary-move, which owns these checks.
- [ ] Send each bounded move once with an increasing non-negative seqNum; begin a new session at 1. Use the exact documented payload fields instead of guessing units or field names.
- [ ] stop-session stops movement; end-session exits remote-control mode. Explicit callers own cleanup: stop when feedback is lost or an outcome is uncertain, then end the session even after a failed/canceled operation, using a separate bounded cleanup context where applicable. Neither command requests docking.
- [ ] Do not leave an explicit session active or mix direct move commands with a unary-move session. After cleanup, use the declared return-to-dock command if requested and verify fresh docking/charging state.

Room cleaning does not navigate without cleaning. Only use a declared navigation operation for "go to the kitchen"; the current Roborock integration has none. Missing Kitchen membership is not permission to guess another room or coordinates. Explain the limitation and offer supported short remote moves only when visual feedback is available. "Go back home" uses the declared vacuum return-to-dock command after ending remote control; verify fresh docking/charging state instead of equating acceptance with arrival. Unavailable visual feedback, including a blocked camera, prevents visually guided exploration; do not improvise an unseen route. Missing snapshot support alone does not block movement when advancing live video is available.
