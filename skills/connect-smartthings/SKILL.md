---
name: connect-smartthings
description: Use this guide when the customer wants to link SmartThings to read and control SmartThings devices, or to replace an old personal access token connection.
metadata:
  title: Connect SmartThings
  guide-id: smartthings
  slug: smartthings
  capabilities: power
  content-authorship: HUMAN_MIXED_WITH_AI
  author: Port OS Team
  last modified: 2026, october, 25
---

# Connect SmartThings

Link SmartThings to Port OS to read and control your SmartThings devices.

## Register your SmartThings app

You register an OAuth-In app with Samsung's SmartThings CLI on your own computer, then enter its client ID and client secret in the Port OS website. Every step here is yours to do; an assistant only explains them.

An assistant helping with this guide never installs software, never runs these commands for you, and never asks for, reads or repeats the client secret. The secret goes only into the Port OS website form in step 6.

### 1. Get the SmartThings CLI

Install the SmartThings CLI by following Samsung's instructions on the [SmartThings CLI page](https://github.com/SmartThingsCommunity/smartthings-cli#installation). In your own terminal, `smartthings --version` confirms it is installed.

### 2. Copy the Redirect URI from Port OS

Copy this link to set up the SmartThings account.

```text
https://auth.portoperatingsystem.com/plugins
```

### 3. Create the app

In your own terminal, run `smartthings apps:create`. On the first command, the CLI opens a browser window. Sign in with your Samsung account and grant the CLI access. When asked for the app type, choose **OAuth-In App**.

### 4. Set the OAuth redirect URI and scopes

When the CLI asks for the redirect URI, paste the Port OS setup page URL from step 2. When it asks for scopes, select the four scopes listed under Required scopes.

### 5. Copy the client ID and client secret

The CLI prints the app's OAuth client ID and client secret. The secret is shown once, so copy both now. Treat the secret like a password: paste it only into the Port OS website, never into a chat.

### 6. Enter the credentials in Port OS

Back in Port OS, enter the client ID in **OAuth client ID** and the secret in **OAuth client secret**, then click **Save credentials**. Port OS stores the secret on the backend and never shows it again. The credentials are now saved and nothing is authorized yet: continue with the next step now, or come back later and choose **Connect to SmartThings**. You do not need to enter them again.

### 7. Approve access on SmartThings

SmartThings asks you to sign in, choose a location and approve access. Approve it. Port OS then shows SmartThings as connected and lists your devices.

### Redirect URI

The redirect URI registered with the app must match the value the Port OS connect screen shows, character for character, including the scheme, host, path and any trailing slash. SmartThings sends you back to the Port OS auth host, which relays the result to the website.

### Required scopes

Select these scopes when you register the app:

- `r:devices:*`
- `w:devices:*`
- `x:devices:*`
- `r:locations:*`

## Personal access tokens

Personal access tokens (PATs) are no longer supported for SmartThings. An old SmartThings link that uses a personal access token stops working and must be deleted and connected again. Delete that link and connect SmartThings again with OAuth, using your own SmartThings app. Revoke the old token in your SmartThings account when you no longer need it.

## Troubleshooting

- **Redirect mismatch.** The app's redirect URI differs from the one Port OS shows. Copy it again from the connect screen and update the app with the SmartThings CLI (`smartthings apps:oauth:update`).
- **Invalid client (`invalid_client`).** The client ID or secret is wrong, or the secret was regenerated. Re-enter both and save again before authorizing.
- **`AUTH_LINK_NOT_READY`.** The connection is still a draft that is missing required values, usually the client secret. Save both client ID and secret, then authorize.
- **Missing devices or permission errors.** The app was registered without all four scopes. Update the app's scopes, then delete the connection and connect again.
- **Connection stops working.** The connection used a personal access token. See Personal access tokens.
- **Stale callback.** An authorization that was started earlier, or opened twice, can return after it expired or was replaced. Close the tab and choose **Connect to SmartThings** again.
