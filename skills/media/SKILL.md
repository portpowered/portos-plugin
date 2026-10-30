---
name: media
description: Use this guide to search and play audio, build or extend the active playback queue, save or edit playlists, pause playback, set volume or launch content on a media device.
metadata:
  title: Control media playback
  guide-id: media
  capabilities: media-player media-queue media-playlist media-search speaker content-launcher
  content-authorship: HUMAN_MIXED_WITH_AI
  author: Port OS Team
  last modified: 2026, october, 30
---

# Control media playback

Enumerate permitted media endpoints and inspect declared playback, volume and content-launcher capabilities in [the capability directory](https://portoperatingsystem.com/docs/for-ai/capability-interfaces.md). Select the logical endpoint or native media group only when its declarations support the requested operation. Use generic MCP `control` with the target ID, message ID from query results and exact payload, or [REST dispatch](https://portoperatingsystem.com/docs/for-ai/guides/quickstart.md) with the exact message/payload/version. Port OS selects compatible provider routes. For correlated search, library and queue reads, set MCP `waitForResult:true` or REST `responseType:"SYNC"`; an accepted receipt alone contains no read result.

Absolute volume and relative volume changes have different retry behavior. Validate units/ranges. Ordinary playback and volume commands use waitForResult:false; acknowledge acceptance and stop. Query fresh observations only for requested verification, a relative action needing a current value, or uncertain-outcome diagnosis. Accepted playback is not proof of audible output. On lost relative-command responses, recover the result/read back or report unknown; do not apply the increment twice.

For ordinary media controls on a customer-defined Port OS group, use its declared group control. Port OS selects native dispatch or the individual effective members; do not reconstruct recipients from a provider group. Queue and session writes require the selected native route's declarations and must not be emulated with per-member writes.

## Build a live music queue

For “set up a playlist of lo-fi songs and play it on my Sonos,” build a live queue unless the customer also asks to save a playlist. A playback queue belongs to the selected player session; a saved playlist belongs to a provider library.

1. Query permitted endpoints and native groups, including their messages and configurations. Select the customer's logical speaker or native group unambiguously; Port OS chooses a compatible provider. Declared single-track `play-media` does not imply playlist or queue support. Physical speakers must remain singleton logical players; select the authorized native group for grouped playback. Never infer the same physical device or group from a similar name alone or fan queue writes out to members. Resolve a typed target ambiguity before another control.
2. Search the connected Spotify library with `media-search/search-media`, for example `{"query":"lo fi","type":"track"}`. Collect playable track IDs from results, optionally refining the search or traversing `get-media` children. Copy canonical IDs verbatim; never invent an ID or submit a search phrase as one.
3. Check every selected item against the target's declared `media-queue` `supportedMediaResources` and `maxItemsPerPlay`. Send one `media-queue/play-queue` with `{"mediaIds":["<returned track ID>","<returned track ID>"]}` to the logical endpoint/group. This starts the ordered selection and may interrupt current playback. `play-queue` has no `queueVersion` field; `requiresQueueVersion` applies only to `add-to-queue`. Do not simulate a queue by repeatedly calling single-item `play-media`.
4. Acknowledge the accepted play request and stop. If the user asks for queue contents or verification, read fresh playback/now-playing on the same logical target and call `media-queue/get-queue` with `{}`. The correlated `queue-contents` result separates `currentMediaId` from upcoming `mediaIds`. `complete:false` means a provider-limited window, including when the array is empty; missing items are not proven absent. Report acknowledgement separately from confirmed playback and audible output.

A failed search does not establish that the player stopped or the whole connection is unavailable. Preserve current playback and report the failed operation; use fresh Sonos observations before describing its playback state. Do not replace failed search results with remembered song names or invented playable IDs. `search-media` uses lowercase `"type":"track"`, even when capability configuration lists `TRACK`.

Spotify may retain manually queued items when starting a new selection, and does not guarantee ordering across Player API operations. Do not promise that play-queue clears an old queue. Play-queue can explicitly activate the selected Connect target; get-queue and add-to-queue require it already active and never transfer playback.

For clients that expose only MCP tools and no bundled skills or resource reader, the `control` tool description includes this live-queue recipe and its payload fields. Use that advertised recipe rather than assuming a `resources/read` bridge exists or asking the customer for API schemas. Missing guidance for another operation is a reason to report the limitation rather than guess its payload.

## Add music and manage the queue

For “add more like this,” inspect fresh playback and the queue, search for appropriate tracks, and send `media-queue/add-to-queue` with `{"mediaId":"<returned track ID>"}` once per desired track on the same route. Append does not restart playback. Send requests sequentially and inspect the observed queue before reporting the addition confirmed; Spotify does not guarantee ordering across separate writes. Preserve intentional repeats, and avoid adding duplicates unless requested.

On a native Sonos route, `requiresQueueVersion:true` requires a fresh `get-queue` first. Copy its `queueVersion` verbatim into add-to-queue, for example `{"mediaId":"<returned track ID>","queueVersion":"<returned revision>"}`. Before a subsequent append that requires a revision, read again to obtain it. A conflict means the queue changed; inspect it and reconsider the requested addition rather than replaying it. Sonos returns complete hosted upcoming contents, preserves occurrence IDs for repeats, and refreshes the existing session without play or reload. Refresh failure can leave the append committed; the revision and contents do not prove that the player fetched or audibly played it. Native queues are bounded to 1,000 items and expire 24 hours after creation; append does not extend expiry. An external controller's queue, radio session or legacy single-track grant must not be treated as a managed native queue. Explain a missing or changed queue and get explicit intent before starting a replacement selection. Spotify does not support conditional revisions; omit queueVersion there.

An error or timeout may leave a write applied but unconfirmed. Never automatically repeat play-queue, append, or relative transport controls. Read back and report uncertainty when the provider's bounded queue cannot establish the result. Do not claim removal, reorder, clear, shuffle or play-next support unless the selected route explicitly declares those operations. Ongoing replenishment requires an explicit customer request and supported scheduling; a queue request alone does not authorize a background loop.

## Save or edit a playlist

Only when the customer asks to save a reusable collection, use the library route's declared `media-playlist` messages: `create-playlist`, `list-playlists`, `get-playlist`, `add-to-playlist`, `remove-from-playlist`, `rename-playlist` or `unfollow-playlist`. Playlist mutations return `playlist-mutation-result`; read back contents to verify. `applied:false` can mean a playlist was created but initial tracks were not confirmed, so inspect before another write. Unfollow removes it from the account library and does not permanently delete it.

Editing a saved playlist does not prove the active playback queue changed. To play a saved playlist, use `media-player/play-media` with its exact ID only on a route declaring the playlist resource kind. On a track-only queue route, read the saved playlist's children and pass their playable track IDs to play-queue within the advertised bound. Missing queue declarations, restricted Connect devices, or missing playback permission are limitations to explain; they are not permission to redirect playback.
