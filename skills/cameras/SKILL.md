---
name: cameras
description: Use this guide when the customer wants a camera snapshot, a recording or a live stream.
metadata:
  title: Read camera captures and streams
  guide-id: cameras
  capabilities: camera snapshot recordings rtsp-session
  content-authorship: HUMAN_MIXED_WITH_AI
  author: Port OS Team
  last modified: 2026, october, 8
---

# Read camera captures and streams

Camera access requires operation scope and authorization for the selected camera/action. Light-control permission grants no imagery access. Inspect declared camera/snapshot schemas in [the directory](https://portoperatingsystem.com/docs/for-ai/capability-interfaces.md).

For packages, visitors, weather or cars, select the permitted room/outdoor camera; clarify ambiguous views. Inspect captured pixels with timeOfSample. Memory is not live evidence. Declared pan/tilt requires a follow-up snapshot; acceptance proves no movement.

For current imagery, send get-snapshot with responseFormat BASE64 (inline) or URL (short-lived link). If hosting is unavailable, use BASE64. Check timeOfSample and URL expiresAt; a new link can contain an old capture. Verify retrieval before claiming to have viewed it. Recapture expired/stale images or explain the limitation. Streams use their declared lifecycle/transport.

Read [authorization rules](https://portoperatingsystem.com/docs/for-ai/guides/authorization-rules.md) and [async outcomes](https://portoperatingsystem.com/docs/for-ai/guides/using-the-api.md).
