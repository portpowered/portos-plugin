# Check phone, Watch and tracker batteries

For "is my phone dead?", "check my Apple Watch", or "should I charge it?":

1. Discover phone/iPhone/Watch names and inspect provider routes plus battery/connectivity interfaces. If a broad query finds Tile/Alexa tracker records as well as Apple iCloud, select the intended Apple device. Prefer its current route-backed record rather than obsolete reconnect duplicates. An endpoint type TRACKER can represent a phone or Watch; do not filter only for PHONE.
2. Query its copied exact endpointId with expand:["battery","connectivity"] and forceDeviceAttributeQuery:true, using only declared capabilities. No control command or phone sound is needed for this question.
3. Interpret each observation separately. Battery level 0 with status available is reported zero; available reachability UNREACHABLE means offline. Offline alone does not prove the battery is depleted. An unavailable/stale/missing battery is unknown, not 0%. Missing sampledAt means no provider measurement time is supplied.
4. Recommend charging for reported zero/low battery; for offline with unknown battery, say it could need charging or reconnection rather than claiming it is dead. Relay the actual percentage and reachability. Do not claim freshness beyond the available forced-read result when Apple exposes no measurement timestamp.
5. For "ping my phone" or "find my phone", read portos://guides/find-phone. That guide distinguishes a requested sound from a location lookup. A battery question does not request either; do not send a locator command or query precise location merely to read battery.

AUTHORIZATION_CREDENTIAL_EXPIRED asks the user to sign in again when automatic recovery cannot renew the account; it does not mean the device battery is dead. Charging notifications require a separately requested monitor/schedule; a one-time battery question does not create one.
