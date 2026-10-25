---
name: connect-spotify
description: Use this guide when the customer wants to link Spotify to search music, manage playlists or control Spotify Connect devices.
metadata:
  title: Connect Spotify
  guide-id: spotify
  slug: spotify
  capabilities: media-player media-playlist media-search
  content-authorship: HUMAN_MIXED_WITH_AI
  author: Port OS Team
  last modified: 2026, october, 23
---

# Connect Spotify

Link Spotify to Port OS to search music, manage playlists and control Spotify Connect devices.

## Create your Spotify app

You create an app in the Spotify developer dashboard, then give Port OS its client ID and client secret. You need a Spotify account.

### 1. Copy the Redirect URI from Port OS

Copy this link to set up the Spotify account.

```text
https://auth.portoperatingsystem.com/plugins
```

### 2. Create an app in the Spotify dashboard

Sign in to the [Spotify developer dashboard](https://developer.spotify.com/dashboard) and click **Create app**.

![Spotify for Developers dashboard with the Create app button](https://portoperatingsystem.com/guides/spotify/01-dashboard.webp)

### 3. Name the app

Enter an app name and a description. Anything works, for example **Port OS** and **Connects my Spotify account to Port OS**. The website field is optional.

![The Spotify Create app form with the app name and description filled in](https://portoperatingsystem.com/guides/spotify/02-create-app-form.webp)

### 4. Add the Redirect URI and choose Web API

Paste the Redirect URI from step 1 into **Redirect URIs** and click **Add**. Under **Which API/SDKs are you planning to use?**, tick **Web API**.

![The Redirect URIs list showing the Port OS redirect URI, with Web API ticked](https://portoperatingsystem.com/guides/spotify/03-redirect-and-web-api.webp)

### 5. Accept the terms and save

Tick the box to accept Spotify's Developer Terms of Service and Design Guidelines, then click **Save**.

![The terms checkbox ticked and the Save button](https://portoperatingsystem.com/guides/spotify/04-terms-and-save.webp)

### 6. Copy the client ID and client secret

The app opens on **Basic Information**. Copy the **Client ID**. Then click **View client secret** and copy the secret. Treat the secret like a password: do not paste it into chat, a document or a screenshot.

![App settings showing the Client ID field and the View client secret link; the client ID is hidden in this example](https://portoperatingsystem.com/guides/spotify/05-client-id.webp)

### 7. Add the Spotify accounts that will connect

New apps start in **Development mode**, which only lets accounts you add sign in. Open the **User Management** tab, enter the name and email of each Spotify account that will connect, and click **Add user**. A development-mode app accepts up to five users. Add the account you will sign in with in step 9.

![The User Management tab with the Full Name and Email fields and the Add user button](https://portoperatingsystem.com/guides/spotify/06-user-management.webp)

### 8. Enter the credentials in Port OS

Back in Port OS, paste the client ID into **OAuth client ID** and the client secret into **OAuth client secret**, then click **Save credentials**. Port OS stores the secret on the backend and never shows it again. The credentials are now saved and nothing is authorized yet: continue with the next step now, or come back later and choose **Connect to Spotify**. You do not need to enter them again.

### 9. Approve access on Spotify

Spotify opens and asks you to approve the access Port OS requests (see Required scopes). Sign in with an account you added in step 7, then approve the request. Port OS then shows Spotify as connected, and your playlists and playback devices become available.

### Redirect URI

The Redirect URI in the Spotify dashboard must match the value the Port OS connect screen shows, character for character, including the scheme, host, path and any trailing slash. Spotify sends you back to the Port OS auth host, which relays the result to the website. Use the value the screen shows, not one copied from elsewhere.

### Required scopes

Port OS requests these scopes. You do not configure scopes in the dashboard; approve them on the Spotify consent screen.

- `user-read-playback-state`
- `app-remote-control`
- `user-modify-playback-state`
- `playlist-read-private`
- `playlist-read-collaborative`
- `playlist-modify-private`
- `playlist-modify-public`
- `user-library-modify`

### Quota and development mode

New Spotify apps start in development mode. Under Spotify's July 2026 update, only users on the app's allowlist can sign in until Spotify grants the app extended quota. Quota limits are counted by Spotify, not Port OS; see Spotify's [quota modes](https://developer.spotify.com/documentation/web-api/concepts/quota-modes) and the [July 2026 Web API quota update](https://developer.spotify.com/blog/2026-07-23-web-api-quota-updates) for current limits.

## Troubleshooting

- **Redirect mismatch (Spotify shows "INVALID_CLIENT: Invalid redirect URI").** The dashboard Redirect URI differs from the one Port OS shows. Copy it again from the connect screen and save the dashboard app.
- **Invalid client (`invalid_client`).** The client ID or secret is wrong, or the secret was regenerated. Re-enter both from the dashboard and save again before authorizing.
- **`AUTH_LINK_NOT_READY`.** The connection is still a draft that is missing required values, usually the client secret. Save both client ID and secret, then authorize.
- **Spotify refuses sign-in for your account.** The app is in development mode and your Spotify account is not on its allowlist. See Quota and development mode.
- **Stale callback.** An authorization that was started earlier, or opened twice, can return to Port OS after it expired or was replaced. Close the tab and choose **Connect to Spotify** again to start a fresh attempt; the previous one is not reused.
