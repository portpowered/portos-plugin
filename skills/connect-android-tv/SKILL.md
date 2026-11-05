---
name: connect-android-tv
description: Use this guide when the customer wants to control a Google TV or Android TV from Port OS, install the Port OS Android TV app, pair it, or fix a TV that does not react to commands.
metadata:
  title: Connect an Android TV
  guide-id: android-tv
  slug: android-tv
  capabilities: media-player speaker keypad-input touch-input snapshot connectivity
  content-authorship: HUMAN_MIXED_WITH_AI
  author: Port OS Team
  last modified: 2026, november, 2
---

# Connect an Android TV

Install the Port OS app on a Google TV or Android TV, and Port OS can play media on it, change its volume, press its remote buttons, tap its screen, take a picture of its screen and know what is playing. The TV needs no hub and no new device in the house. It does need Google Play Services, because Port OS reaches the app through Firebase Cloud Messaging (FCM), so Fire TV and TVs without Play Services are not supported. The TV must be switched on: an app on a sleeping TV cannot receive commands.

An assistant helping with this guide explains the steps, but you do them on your own computer and your own TV.

## Before you start

- A TV running Google TV or Android TV, on the same Wi-Fi as your computer.
- A computer with the [Android platform tools](https://developer.android.com/tools/releases/platform-tools) installed, so that `adb --version` works in your terminal.
- A Port OS account you can sign in to on the website.

### Install adb on your computer

adb (Android Debug Bridge) is the command-line tool that installs the app and grants its permissions. It is part of Google's Android platform tools. Install it with the package manager for your system:

- **Windows** (PowerShell): `winget install Google.PlatformTools`
- **macOS** (Homebrew): `brew install --cask android-platform-tools`
- **Linux** (Debian or Ubuntu): `sudo apt install adb`

Or download the platform tools zip for your system from the [Android platform tools page](https://developer.android.com/tools/releases/platform-tools), unzip it and run `adb` from that folder. Open a new terminal afterwards and check that it works:

```text
adb --version
```

## 1. Turn on developer options and wireless debugging

1. On the TV open **Settings > System > About** and select **Android TV OS build** (or **Build**) seven times until the TV says developer mode is on.
2. Open **Settings > System > Developer options** and turn on **USB debugging** and **Wireless debugging**.
3. Open **Wireless debugging**, note the IP address and port it shows, and choose **Pair device with pairing code** if the TV asks you to pair first.
4. On your computer connect to the TV, replacing the address with the one the TV shows:

```text
adb connect 192.168.1.50:5555
```

The TV asks you to allow the computer. Choose **Always allow**. `adb devices` lists the TV as `device` when it works.

## 2. Install the app

Download the newest app from the [latest release](https://github.com/portpowered/portos-android-tv/releases/latest) of the public [portos-android-tv](https://github.com/portpowered/portos-android-tv) repository, which also holds its source:

```text
https://github.com/portpowered/portos-android-tv/releases/latest/download/portos-android-tv.apk
```

Then install it on the TV:

```text
adb install -r portos-android-tv.apk
```

The app is `com.portoperatingsystem.tv`. It appears with the other apps on the TV home screen.

## 3. Grant the permissions the app needs

Android blocks an app in the background from opening other apps, from seeing what is playing and from pressing buttons for you, and a TV has no screen where you can grant these in the app. Run these commands once from your computer:

```text
adb shell appops set com.portoperatingsystem.tv SYSTEM_ALERT_WINDOW allow
adb shell cmd notification allow_listener com.portoperatingsystem.tv/com.portoperatingsystem.tv.state.MediaSessionListener
adb shell settings put secure enabled_accessibility_services com.portoperatingsystem.tv/com.portoperatingsystem.tv.control.PortOsAccessibilityService
adb shell settings put secure accessibility_enabled 1
```

The first lets Port OS open YouTube or Spotify on the TV when you ask. The second lets the app read the active media session, so Port OS knows what is playing. The last two switch on the Port OS accessibility service, which presses the remote buttons (for example Select, to dismiss YouTube's "Who's watching?" screen), taps the screen where Port OS points (for apps such as YouTube that ignore Select on older Android versions) and takes a picture of the screen when you ask. Without them, commands still arrive, but the TV cannot start apps, Port OS cannot tell what is playing, and buttons, taps and screen pictures do not work. The app shows a setup screen that says which of them is missing and reports it to Port OS.

If the TV already uses another accessibility service, run `adb shell settings get secure enabled_accessibility_services` first. When it prints something other than `null`, add the Port OS service after the existing value, separated by a colon, instead of replacing it:

```text
adb shell settings put secure enabled_accessibility_services EXISTING_SERVICE:com.portoperatingsystem.tv/com.portoperatingsystem.tv.control.PortOsAccessibilityService
```

## 4. Pair the TV with Port OS

1. Open **Port OS** on the TV. It shows a code and a QR code.
2. On your phone or computer, scan the QR code or open the address it shows, sign in to Port OS and approve the code.
3. The TV shows that it is connected. In Port OS the TV appears under your devices with its name, for example **Living Room TV**.

## 5. Try it

Ask your assistant to pause the TV, change its volume, press Select on it or tell you what is playing on it. Port OS shows the TV's volume, mute state and playback state a few seconds after it changes, the app reports every minute while something plays, and it confirms it is reachable about every fifteen minutes.

For an assistant (or anyone reading the TV through the API), these are the calls that matter:

- **What is playing, and in which app.** Read now-playing with a fresh query: `endpoint_query` with `endpointId`, `expand ["media-player"]` and `forceDeviceAttributeQuery true`. The TV is asked for a new reading and answers within a few seconds. Without `forceDeviceAttributeQuery` you get the last reading the TV pushed, which can be a minute or more old. now-playing names the app (`appId` such as `com.google.android.youtube.tv`, and `provider` `YOUTUBE` or `SPOTIFY`), the title (`name`), the full `portos-media` `mediaId` when the app exposes one (it is left out otherwise), and `positionMs`.
- **Play, pause, next, previous, stop.** These `media-player` commands act on whichever app holds the active media session, YouTube or Spotify alike. If `media-player` `pause` is ambiguous because the endpoint also has another media-player route, send `keypad-input` `send-key` with `{"keyCode":"PAUSE"}` (or `PLAY`), which reaches the same session.
- **Seek and skip.** `media-player` `seek` with `{"positionMilliseconds":90000}` jumps to that position of the current item, `skip-forward` and `skip-backward` with `{"deltaPositionMilliseconds":10000}` move that far from where it is now (the distance is required), and `start-over` with `{}` goes back to the beginning. They act on the same active session and work only when the playing app lets other apps seek (YouTube and Spotify do). Otherwise the TV logs why and nothing moves, so read now-playing `positionMs` afterwards. Needs app 0.5.2 or later.
- **Open an app.** `application-launcher` `launch-application` with `{"catalogVendorId":0,"applicationId":"com.netflix.ninja"}` opens that Android package on the TV (catalog 0 means Android package names). The apps the TV can open are in the interface's `application-list` attribute, as package names only (no labels). An unknown or non-launchable package is not refused by the API: the delivery succeeds and the TV logs `APP_NOT_LAUNCHABLE`, so check with a `snapshot`. Needs the route rediscovered after the app updates to 0.5.2.
- **Check that a command worked.** A command succeeds when Google accepts it for delivery, which does not mean the TV acted. Read now-playing again with `forceDeviceAttributeQuery true`, or take `snapshot` `get-snapshot` with `responseFormat: BASE64` and look at the screen. `play-media` is the same: it opens the app on the media, so confirm it is playing the same way.

## Troubleshooting

- **The TV does not react to commands.** Check that the TV is on and online, then open the Port OS app once. If Port OS says the TV needs to be paired again, the app was reinstalled or its data was cleared: pair it again from step 4.
- **Commands arrive but nothing opens.** The first permission in step 3 is missing. Run the `SYSTEM_ALERT_WINDOW` command again.
- **Buttons or screen pictures do nothing.** The accessibility service from step 3 is not enabled. Run the two `settings put secure` commands again (keeping any other service in the list), then open the Port OS app: it says when the service is off.
- **Port OS does not know what is playing.** The second permission in step 3 is missing. Run the `allow_listener` command again, and check that the component name is printed exactly as above.
- **`adb: failed to connect`.** Wireless debugging reports a new port each time it is switched on. Read the address from **Developer options > Wireless debugging** again.
- **Pairing says the code is not valid.** The code expires after a few minutes. Close the app, open it again and approve the new code.
- **The TV disappeared from Port OS.** Delete the old connection in Port OS and pair the TV again.
