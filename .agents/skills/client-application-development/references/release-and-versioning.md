# Release And Versioning Reference

## Resolution rule

Use one canonical version source. A release request resolves in this order:

1. Read the current stable version from the project's authoritative file or release metadata.
2. Infer the bump from explicit intent: patch for fixes, minor for compatible features, major for an intentional breaking contract.
3. If no impact is stated, use the project's default, normally patch.
4. Calculate the next version and show it before publication.
5. Synchronize verified consumers, build, verify, tag, and publish.

The normal user interface is `发布` or a similarly clear release request. Never require `发布 vX.Y.Z` as a ceremony. An explicitly supplied version is an optional constraint that must be validated for monotonicity, uniqueness, and project policy.

## Candidate contract

Each candidate should have:

- stable version and commit identity;
- target platform and architecture;
- artifact name, URL/object key, byte size, SHA-256, and signature/provenance;
- release manifest schema and minimum compatible launcher/client version;
- build and verification evidence;
- immutable publication identity.

Do not overwrite an existing tag or asset. Do not publish a pointer before all referenced immutable assets are readable and verified. A release workflow may be triggered by a version tag, a protected manual dispatch, or an approved API action, but the trigger must not bypass deployment authorization.

## Here-style pattern

Here is a reference for the shape, not a dependency: calculate the next Installer version from stored metadata, build only when the candidate is absent, verify or reuse an existing immutable MSI, publish it once, then update the release metadata. Apply this pattern to the project's own installer or store and keep the version calculation independent from artifact upload.
