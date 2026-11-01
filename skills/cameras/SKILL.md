---
name: cameras
description: Use this guide when the customer wants a camera snapshot, a recording or a live stream.
metadata:
  title: Read camera captures and streams
  guide-id: cameras
  capabilities: camera snapshot recordings rtsp-session
  content-authorship: HUMAN_MIXED_WITH_AI
  author: Port OS Team
  last modified: 2026, october, 31
---

# Read camera captures and streams

Camera access requires operation scope and authorization for the selected camera/action. Light-control permission grants no imagery access. Inspect declared camera/snapshot schemas in [the directory](https://portoperatingsystem.com/docs/for-ai/capability-interfaces.md).

Select the permitted view; clarify ambiguity. Inspect captured pixels and timeOfSample. Verify movement with a new snapshot.

For current imagery, send get-snapshot with responseFormat BASE64 (inline) or URL (short-lived link). If hosting is unavailable, use BASE64. Check timeOfSample and URL expiresAt; a new link can contain an old capture. Verify retrieval before claiming to have viewed it. Recapture expired/stale images or explain the limitation. Streams use their declared lifecycle/transport.

Ring `camera/step-ptz` requires the caller's active RTC `sessionId` and a `direction` from `supportedPtzStepDirections`: LEFT/RIGHT/UP/DOWN. It moves one bounded step. Inspect uncertain movement before retrying. Absolute positions and zoom are unsupported.

Read [authorization rules](https://portoperatingsystem.com/docs/for-ai/guides/authorization-rules.md) and [async outcomes](https://portoperatingsystem.com/docs/for-ai/guides/using-the-api.md).
