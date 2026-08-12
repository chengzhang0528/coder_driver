---
name: client-application-development
description: Standardize client application development, installation, release, automatic update, signing, rollback, and lifecycle validation across desktop, launcher, updater, native, mobile, and web clients. Use for Chinese requests about 开发客户端、发布、自动更新、安装程序、版本、回滚 or similar client delivery work.
---

# Client Application Development

Use one lifecycle method across client types while preserving each project's framework and distribution contract. Tauri, Electron, Wails, native apps, stores, package managers, and web/CDN delivery are adapters, not mandates.

Keep product facts in the project's ProductContract, Decision, CurrentDesign, source, tests, and Runbook. This Skill stores only reusable method. Do not copy another project's language, cloud provider, installer format, or paths.

## 1. Establish The Contract

Before implementation, identify:

- client variant, supported OS/device/browser and architectures;
- distribution target and installer/store/package boundary;
- canonical version source and every synchronized consumer;
- update ownership: installer, launcher/updater, running client, or platform store;
- user confirmation boundary for download, restart, session interruption, permissions, and activation;
- this request's execution type: Development, explicitly requested SystemTest, or explicitly authorized Deployment.

Never infer SystemTest or Deployment from build success, CI, a tag, a candidate, or Git push. If formal sources conflict, repair the single fact owner before expanding scope.

## 2. Resolve Release Intent Like Here

Make the normal release request human-friendly and deterministic:

1. Read the canonical current version.
2. Infer the bump from explicit intent; default to the next patch for an unspecified release. Use minor/major only when project policy or clear intent supports it.
3. Synchronize verified version consumers and calculate the next version automatically.
4. Build and verify an immutable candidate, then resolve the tag, manifest, metadata, and artifact names from that same version.
5. Show the resolved version before irreversible publication.

`发布` means “calculate and prepare the next release,” not “make me type a version.” `发布 v0.1.1` is an optional explicit constraint to validate for monotonicity and uniqueness; it is never the required convention. Do not overwrite an existing tag or immutable asset. Release intent is not Deployment authorization: named-target publication still needs the project's controlled Deployment workflow, target, admission evidence, authorization, and rollback.

## 3. Use The Common Lifecycle

Apply only the stages relevant to the client variant:

`discover -> build -> verify -> publish immutable assets -> check -> download -> verify -> stage -> drain active work -> confirm -> activate -> health check -> retain previous/rollback`

### Build and publish

- Build a candidate for every supported platform/architecture.
- Generate a manifest with release identity, platform, architecture, minimum compatible client/launcher version, artifact location, size, SHA-256, signature/provenance, and bundled component versions.
- Verify before publication. Upload immutable assets first; update a pointer/index last. Use the existing GitHub Release, registry, store, or CDN rather than inventing a server.
- Preserve third-party license and notice metadata.

### Installer and updater

- Installer/package store: first install, prerequisites, repair, integration, uninstall, and platform policy. It is normally a one-time bootstrap.
- Launcher/updater: routine app or bundled-runtime updates; use a helper because a running process cannot safely replace itself.
- Keep system prerequisites separate from app-managed components and define their owner. Do not force MSI/NSIS or a desktop installer onto store, mobile, CLI, or web variants.

### Runtime update

- Check on launch and periodically with bounded delay; add jitter when needed and honor an explicit opt-out.
- Resolve the compatible release from the manifest, not from filenames.
- Download in the background to temporary files; enforce HTTPS/trusted transport, bounded sizes and safe paths; verify size, SHA-256, and required signature/provenance; atomically move into private staging.
- Keep the current version runnable until activation succeeds. Never force-close active sessions, terminals, jobs, or user work. Mark the candidate waiting for the project's drain condition.
- Activation/restart/version switching requires explicit user action unless the project contract explicitly allows activation with no active sessions. Expose pending state and the remaining action.

### Activation and rollback

- Lock and revalidate immediately before activation; activate atomically through the platform-supported mechanism.
- Retain the previous known-good release. Run a minimal process/UI/runtime health check.
- On activation or health failure, restore the previous release without deleting user data/configuration. Record release, phase, error, and rollback evidence. Never remove the only known-good release.

## 4. Security, Compatibility, Verification

- SHA-256 proves integrity, not publisher identity. Require code signing, notarization, or store provenance for official distribution where supported. Without required signing, stop formal publication or label the artifact as an unsigned candidate.
- Reject mismatched platform/architecture, invalid versions/manifests, unsafe paths, wrong size/digest, truncated downloads, invalid signatures, accidental downgrades, and incompatible components.
- Keep binaries, configuration, credentials, user data, and migrations in separate ownership boundaries. Never commit keys, tokens, customer data, logs, or generated secrets.
- For Development, run affected source/type checks and focused tests. Include positive and nearby negative cases for version calculation, staging, active-work waiting, cancellation, activation failure, health failure, and rollback.
- Run SystemTest only when independently requested, against a fixed candidate and environment, without changing the product under test. Run Deployment only when explicitly authorized through the project's controlled plan and Runbook.

## 5. Release Candidate Black-Box Acceptance

For desktop clients, build and source checks are not the release completion gate. After the target Release is public, validate the exact published asset as a user would:

- Download the installer from that Release, then verify API-reported size, SHA-256, platform, architecture, and signing/provenance status.
- Install or upgrade using the downloaded installer and launch the installed binary, never the worktree or a debug build.
- Assert the startup view, main navigation, key user-visible controls, and the absence of a blank, error, or partially rendered page.
- Assert every user-visible capability changed by the release, such as a manual `检查更新` entry and its checking/result states.
- Record installed version, process/window health, install registration, and bundled runtime/component versions.
- Treat worktree or debug UI checks as supplementary evidence; they cannot replace Release installation acceptance.

## 6. Report And Stop

Report the resolved version and calculation, artifact/platform evidence, manifest and digest, current/staged/activated/previous state, remaining user action, exact verified environment, unsupported cases (recommend an Issue), and Development/SystemTest/Deployment/Git results separately.

Stop if the canonical version owner, target, signing authority, compatibility rule, confirmation boundary, or rollback path is missing and cannot be discovered safely. A local installer is not a published release.

Load references only when needed:

- [release-and-versioning.md](references/release-and-versioning.md): Here-style version and immutable publication rules.
- [lifecycle.md](references/lifecycle.md): state ownership and adapter matrix.
