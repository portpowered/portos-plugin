<!-- Generated from docs/processes/deploying-assistant-plugins.md; edit the monorepo source. -->
# Build and release assistant plugin ZIPs

## Purpose

Owner: Port OS maintainers. The development monorepo's `plugins/portos/` is the
source of truth. [portpowered/portos-plugin](https://github.com/portpowered/portos-plugin)
is the public distribution copy. Its workflows package the same shared skills
and hosted MCP connection for ChatGPT/Codex and Claude.

## Scope

The monorepo owns source, validators and the exported release workflow. This
process covers three host archives, the public repository and platform
submission handoff. Backend deployment and directory approval are separate.

## Prerequisites

- Bun 1.4, Node.js 24.21.0, Git, Make, Claude CLI and GitHub CLI.
- A committed source checkout and a verified MCP backend revision.
- Public repository push/release access and the platform publisher permissions.
- A dedicated temporary publication clone containing no independent work.

## Procedure

### Prepare and verify locally

1. Use the development monorepo with Bun 1.4, Git, Make, Claude CLI and GitHub
   CLI installed. Use a shell supported by the repository's Makefiles. Install
   dependencies with `bun install --frozen-lockfile`.
2. Update source skills under `docs/skills/` or the canonical MCP task guides.
   Edit listing metadata in `plugins/portos/plugin.json` and connection settings
   in `plugins/portos/mcp.json`. Keep the existing plugin identity and MCP URL.
3. Bump `version` in the portable `plugin.json` for a changed release. Generate
   the matching Claude manifest and shared guidance, then build:

   ```sh
   make -C plugins/portos generate
   make -C plugins/portos build
   ```

4. Inspect `dist/assistant-plugins/releases/`. It contains
   `portos-chatgpt-<version>.zip`, `portos-codex-<version>.zip`,
   `portos-claude-<version>.zip` and `SHA256SUMS`.
   ChatGPT and Codex get `plugin.json` and host-specific `mcp.json`; Claude gets
   `.claude-plugin/plugin.json` and `.mcp.json`. All include shared skills and
   assets. Repository workflows, maintainer docs, Git, credentials and backend
   source are excluded from installation ZIPs.
5. Commit the source changes and run a preview:

   ```sh
   make -C plugins/portos deploy DRY_RUN=1
   ```

   The preview builds and validates the package and reports the public diff.
   It does not push. `PLUGIN_CLONE` may select a dedicated temporary publication
   clone; the publisher resets that clone, so do not point it at a working copy.
   `PLUGIN_REMOTE` defaults to the public repository above.

### Push the reviewed source to the public repository

1. Merge the reviewed source into the development monorepo's `main`. Switch to
   a clean `main` matching `origin/main`. A real publication rejects an
   unmerged branch, dirty plugin sources or an out-of-date local main.
2. Run:

   ```sh
   make -C plugins/portos deploy
   ```

   This syncs the built package, both manifests, maintainer instructions,
   `server.json`, and `.github/` release scripts/workflows. The public commit
   records the full source commit. It does not deploy the backend or submit a
   listing to either platform directory.
3. Inspect the [public workflow runs](https://github.com/portpowered/portos-plugin/actions/workflows/release-plugin.yml).
   Every main push produces a downloadable artifact containing all three ZIPs and
   checksums. The workflow runs in the public repository, not the monorepo.
4. Publish a versioned GitHub release with either a matching `v<version>` tag
   on the public commit or a manual run from the public `main`:

   ```sh
   gh workflow run release-plugin.yml --repo portpowered/portos-plugin --ref main
   gh run list --repo portpowered/portos-plugin --workflow release-plugin.yml --limit 5
   ```

5. Wait for success, then download the [release assets](https://github.com/portpowered/portos-plugin/releases):

   ```sh
   VERSION=$(node -p "require('./plugin.json').version")
   gh release download "v$VERSION" --repo portpowered/portos-plugin --dir release-download
   cd release-download
   sha256sum --check SHA256SUMS
   ```

   Both manifests and a release tag must agree. Existing assets are immutable;
   changed bytes require a new version. If an existing tag belongs to another
   commit, bump the source version and repeat the source workflow. A billing-
   blocked Actions run is not a successful workflow release. If Actions is
   unavailable, reproduce from the exact public main commit using the pinned
   runtime, verify checksums and CRCs, and create a draft manually:

   ```sh
   gh release create "v$VERSION" --repo portpowered/portos-plugin --target "$SOURCE_SHA" --draft --title "Port OS $VERSION" --notes-file release-notes.txt
   gh release upload "v$VERSION" --repo portpowered/portos-plugin dist/*.zip dist/SHA256SUMS
   gh release download "v$VERSION" --repo portpowered/portos-plugin --dir release-download
   ```

   Confirm the tag resolves to `SOURCE_SHA`, compare every downloaded asset to
   the local build, then publish with `gh release edit "v$VERSION" --draft=false`.
   Never use `--clobber`; conflicting assets or tags require a new version.
   Record the Actions limitation separately from the manually verified release.

### Submit the ChatGPT package

1. Upload `portos-chatgpt-<version>.zip` to the existing plugin in
   [OpenAI Plugins](https://platform.openai.com/plugins), under the verified
   publisher organization/project. Use **With MCP** for the hosted connection.
2. Review imported metadata, skills and OAuth settings. Connect the canonical
   MCP endpoint, complete domain verification if requested, and resolve scans.
   Keep reviewer credentials in the portal's private fields, outside the ZIP.
3. Complete review information and attestations, submit for review, and publish
   the approved package version. GitHub publication does not perform these steps.
4. Metadata or skill updates need a new ZIP. Hosted tool changes use MCP scans;
   after a backend deployment use **MCPs → Rescan** and inspect the results.

Port OS declares `extensions.com.openai.requires_local_executor: false`; its
remote server and skills require no local process. Imported MCP packages can
still receive a desktop-only classification, including packages with HTTPS
servers, as described in [ChatGPT's import guidance](https://learn.chatgpt.com/docs/enterprise/plugin-management#desktop-only-plugins).
Keep the hosted declaration explicit and use **With MCP** for public submission.
Never add a developer's personal registered-server ID to the public ZIP to
change that classification. Preserve any server mapping generated by the portal
in the saved listing.

The flag controls execution eligibility; it does not register a remote URL as a
ChatGPT web OAuth connection. In a private import, an unregistered raw server
can appear in the package but disappear from the tool inventory when it needs
authentication. For private host acceptance, use Plugin Creator to bind the
complete existing plugin to a verified registered Port OS App using `.app.json`
and `extensions.com.openai.apps`. Preserve its identity, all bundled skills,
presentation and approved connection permissions. Keep that host registration
in the private saved release only. Public submission uses **With MCP** to create
the corresponding host mapping; public packages must reject personal bindings.

Verify the final package in a fresh ChatGPT web chat: inspect the installation
button, load its bundled setup skill, and call its own MCP server with a single
read-only query. A response through a separate custom connector is not package
acceptance. If authentication is needed, verify a usable OAuth sign-in action
before counting the connection as working. Web installation, authenticated
device access and directory approval are separate checks.

Follow [OpenAI's submission guide](https://developers.openai.com/plugins/deploy/submission)
for current account permissions, reviewer evidence and update restrictions.

### Install and verify the native Codex plugin

The public Git root and Codex ZIP use generated `codex.mcp.json` as `mcp.json`.
ChatGPT's ZIP uses generated `chatgpt.mcp.json`, retaining its portal CIMD
settings. Codex currently rejects the per-server OpenAI `extensions` object;
sharing that runtime config silently drops the plugin's MCP server while skills
still load. Keep the host configs separate and generated from the canonical source.

```sh
codex plugin marketplace add portpowered/portos-plugin --ref "v$VERSION" --json
codex plugin add portos@portos --json
codex plugin list --marketplace portos --json
```

For an existing installation, refresh the marketplace to the new version and
reinstall using the native plugin commands. Complete the host's normal OAuth
connection flow. Start a fresh Codex session and verify the installed plugin's
skills and its own MCP discovery/read operation. A pre-existing custom MCP
connection or successful skill loading alone does not accept the shipped artifact.

### Distribute the Claude package

1. Use the GitHub marketplace for compatible Claude Code installations, or
   upload `portos-claude-<version>.zip` in a Claude host supporting plugin ZIPs.
2. Organization owners can use manual ZIP upload or repository syncing as
   described in [Claude's organization plugin guide](https://support.claude.com/en/articles/13837433-manage-plugins-for-your-organization).
3. For the public Claude directory, complete its connector/plugin submission
   and review flow. A GitHub release, marketplace installation or private upload
   does not establish directory approval or successful account authorization.

### Reproduce and verify a release

In a checkout of the exact public release commit with Node.js 24.21.0:

```sh
node .github/scripts/packagePluginRelease.mjs . dist
cd dist
sha256sum --check SHA256SUMS
unzip -t portos-chatgpt-<version>.zip
unzip -t portos-claude-<version>.zip
unzip -t portos-codex-<version>.zip
```

Compare the rebuilt ZIPs to the downloaded release assets. Complete host OAuth
and a read-only discovery check separately. Any device-control acceptance uses
an explicitly selected test account or simulator, with state restored afterward.

## Verification

- [ ] Both manifests and the tag match the packaged semantic version.
- [ ] Public commits identify the exact reviewed monorepo source.
- [ ] All three ZIPs pass CRC, checksum and platform-manifest checks.
- [ ] Published downloads match the pinned-runtime rebuild.
- [ ] A fresh native host loads the installed full artifact's skills and MCP server, completes OAuth and performs read-only discovery.
- [ ] Directory submission, approval, OAuth and host acceptance are recorded separately.
