---
name: vacuums
description: Use this guide when the customer wants a robot vacuum to start, stop, return to the dock or clean particular rooms.
metadata:
  title: Control vacuums and cleaning rooms
  guide-id: vacuums
  capabilities: robotic-vacuum-cleaner cleaning-mode
  content-authorship: HUMAN_MIXED_WITH_AI
  author: Port OS Team
  last modified: 2026, october, 25
---

# Control vacuums and cleaning rooms

Find the robot endpoint and inspect its robotic-vacuum-cleaner and related declarations in [the directory](https://portoperatingsystem.com/docs/for-ai/capability-interfaces.md). Provider support varies; names do not establish room cleaning, schedules or modes.

Use supported start/stop/mode schemas and discovered IDs. Room/zone cleaning targets the robot endpoint; groups are not automatically robot rooms. Clarify ambiguous mappings and check constraints. Send ordinary commands once with `waitForResult: false`, acknowledge accepted/pending and stop; no automatic polling, status read or card. Fresh-read for state questions, requested verification or uncertain-outcome diagnosis. Show `endpoint_show` when requested. Acceptance does not establish completed cleaning. When multiple rooms are supported, send them in one clean-room request in cleaning order. Robot status does not list target rooms: name the rooms sent rather than claiming to read them back.

## Show the map or pick rooms

- [ ] Show the robot's room picker with `endpoint_show`, `primary: house-map`. Never draw maps or floor plans from group geometry or query groups individually to build one.

## Select rooms on the website

- [ ] Select a map room to highlight it; select again to deselect, or use Clear for all selections. Selection sends no command.
- [ ] Select multiple rooms only with `supportsMultiRoomCleaning: true` in robotic-vacuum-cleaner configuration; otherwise select one. Only groups the robot can clean are selectable.
- [ ] Clean selected sends one `clean-room` to the robot with the selected `groupIds`. Read fresh state afterward.

## Start and end remote movement

- [ ] Prefer bounded `unary-move` with working live camera feedback. Roborock handles start, native readiness, five-second startup settling, fresh readiness revalidation, ordered moves and session end.
- [ ] Preserve the requested duration in milliseconds. Settling precedes motion; it never extends motion.
- [ ] `start-session` acceptance is not readiness. Advanced callers must verify healthy native manual mode, settle five seconds and recheck before `move`; RUNNING alone is insufficient. Without these checks, use `unary-move`.
- [ ] For explicit `move`, increase `seqNum` from 1 per session. `stop-session` stops motion; `end-session` exits manual mode. End explicit sessions after success, failure or cancellation, before docking.
- [ ] One-way controls use dispatch acceptance: REST `FIRE_FORGET`, MCP without `waitForResult`. Dispatch errors still surface. Never await a nonexistent reply or automatically retry uncertain physical movement.
